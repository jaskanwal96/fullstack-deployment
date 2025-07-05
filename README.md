Fullstack Deployment 

- Vercel
- AWS
- K8s
- Terraform

# Troubleshooting k3d Ingress for a NestJS Application

This README outlines common issues and their solutions when trying to expose a NestJS application running in a `k3d` Kubernetes cluster via Ingress, specifically for accessing it via `http://mynode.local`.

## Problem Symptoms

Initially, you might encounter:
*   `404 Not Found` when accessing `http://mynode.local`.
*   `curl: (28) Failed to connect to mynode.local port 80 after ...: Couldn't connect to server` (or similar for other ports like 8080).
*   `ImagePullBackOff` status for your application pods.

## Debugging Steps & Solutions

Follow these steps to diagnose and resolve common ingress issues in a `k3d` environment:

### 1. Verify Kubernetes Service and Ingress Configuration

Ensure your Kubernetes Service and Ingress resources are correctly configured to route traffic to your application's port.

*   **Your NestJS application**: Assumed to be running on `containerPort: 9000` (as named `backend-port` in `deployment.yaml`).
*   **`ops/service.yaml`**:
    *   The service should expose an internal cluster port (e.g., `80`) and map it to your application's actual port (`9000`).
    ```yaml
    # ops/service.yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: backend-app-service
    spec:
      selector:
        app: backend-app
      type: ClusterIP
      ports:
        - protocol: TCP
          port: 80 # Service listens on port 80 within the cluster
          targetPort: backend-port # Maps to your app's containerPort: 9000
    ```
*   **`ops/ingress.yaml`**:
    *   The Ingress should point to the service's exposed port (e.g., `80`).
    ```yaml
    # ops/ingress.yaml
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: mynodeapp-ingress
    spec:
      ingressClassName: traefik # IMPORTANT: Use 'traefik' for k3d default
      rules:
        - host: mynode.local
          http:
            paths:
              - path: /
                pathType: Prefix
                backend:
                  service:
                    name: backend-app-service
                    port:
                      number: 80 # Point to the service's exposed port
    ```
*   **Action**: After making any changes, apply the configurations:
    ```bash
    kubectl apply -f ops/service.yaml
    kubectl apply -f ops/ingress.yaml
    ```
*   **Verification**: Describe the ingress to ensure it reflects the correct service port:
    ```bash
    kubectl describe ingress mynodeapp-ingress
    # Look for Backends: backend-app-service:80
    ```

### 2. Configure Local DNS Resolution (`/etc/hosts`)

For `mynode.local` to resolve correctly on your machine, you need to map it to your `k3d` cluster's IP address.

*   **Find `k3d` cluster IP**: This is typically the IP of the load balancer Docker container.
    ```bash
    docker ps --filter "label=k3d.role=loadbalancer" --format "{{.Names}}" # Get container name
    docker inspect <k3d-loadbalancer-container-name> --format '{{json .NetworkSettings.Networks}}' # Find the IP in "k3d-your-cluster-name" network
    # Example: docker inspect k3d-mera-cluster-serverlb --format '{{json .NetworkSettings.Networks}}'
    # Look for "IPAddress" under the k3d network. Example IP: 172.18.0.6
    ```
*   **Add entry to `/etc/hosts`**:
    *   Open `/etc/hosts` with `sudo` (e.g., `sudo nano /etc/hosts`).
    *   Add a line like: `YOUR_K3D_CLUSTER_IP mynode.local`
        ```
        172.18.0.6 mynode.local
        ```
    *   Save and close the file.
*   **Flush DNS cache** (optional, but good practice):
    *   **macOS:** `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`
    *   **Windows:** `ipconfig /flushdns`
    *   **Linux:** `sudo systemctl restart NetworkManager` (or equivalent)

### 3. Resolve Docker Desktop Host Port Conflicts

`k3d` often tries to map ports from its load balancer to your host machine. If Docker Desktop (or another process) is already using that port, connection failures will occur.

*   **Symptom**: `curl` `Failed to connect to mynode.local port 80/8080/etc.` or `Connection refused`.
*   **Diagnosis**: Check if a process is listening on the conflicting port on your host:
    ```bash
    sudo lsof -i :80 # Check for port 80
    sudo lsof -i :8080 # Check for port 8080
    # Look for "com.docke" or other processes in LISTEN state.
    ```
*   **Solution Options**:
    *   **Option A (Recommended):** Prevent Docker Desktop from listening on the conflicting host port. Go to Docker Desktop Preferences/Settings and look for Kubernetes or network settings. You might need to uncheck "Enable Kubernetes" or adjust port binding configurations.
    *   **Option B (More Disruptive):** Recreate your `k3d` cluster, mapping a *different, unused* host port to the load balancer's port 80.
        ```bash
        k3d cluster delete mera-cluster # Replace with your cluster name
        k3d cluster create mera-cluster --port <NEW_HOST_PORT>:80@loadbalancer
        # Example: k3d cluster create mera-cluster --port 8090:80@loadbalancer
        ```
        *If you choose Option B, remember to access your application via `http://mynode.local:<NEW_HOST_PORT>`.* Your Kubernetes manifests (`service.yaml`, `ingress.yaml`) should still use port `80` internally.

### 4. Load Docker Image into `k3d` Cluster

If your application pods are stuck in `ImagePullBackOff`, it means `k3d` can't find your Docker image.

*   **Symptom**: `kubectl get pods -l app=backend-app` shows `ImagePullBackOff`.
*   **Diagnosis**: Describe a failing pod to see the exact reason:
    ```bash
    kubectl describe pod <your-backend-app-pod-name>
    # Look for "Failed to pull image" errors like "pull access denied" or "repository does not exist".
    ```
*   **Action**:
    1.  Ensure your Docker image is built locally:
        ```bash
        docker build -t mynodeapp:v1 backend/ # Adjust path if needed
        ```
    2.  Import the image into your `k3d` cluster:
        ```bash
        k3d image import mynodeapp:v1 -c mera-cluster # Replace with your cluster name
        ```
    *   **Verification**: Check pod status again: `kubectl get pods -l app=backend-app`. They should transition to `Running`.

### 5. Match IngressClass to Running Controller (Traefik)

`k3d` by default installs Traefik as its Ingress Controller. If your `ingress.yaml` specifies a different `ingressClassName` (e.g., `nginx`), your Ingress rule won't be processed.

*   **Symptom**: Ingress rules don't seem to be applied, even if `kubectl describe ingress` looks correct. `kubectl get pods --all-namespaces` shows `traefik` pods but no `nginx` ingress controller.
*   **Action**: Edit `ops/ingress.yaml` and change `ingressClassName: nginx` to `ingressClassName: traefik`.
    ```yaml
    # ops/ingress.yaml
    spec:
      ingressClassName: traefik # Change this line
      rules:
        # ... rest of your ingress
    ```
*   **Action**: Apply the updated Ingress:
    ```bash
    kubectl apply -f ops/ingress.yaml
    ```

## Final Access URL

After resolving all the above issues, you should be able to access your application. Remember to use the correct host port (e.g., 80 or 8080, depending on your `k3d` cluster's setup):

```
http://mynode.local:<SUCCESSFUL_HOST_PORT>
# Example: http://mynode.local:8080
```
