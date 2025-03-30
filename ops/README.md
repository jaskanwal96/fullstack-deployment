### Create Deployment
```bash
kubectl apply -f deployment.yaml
```

### Label Nodes
```bash
kubectl label nodes <node-name> user-type=alpha
```

#### Use Node Selector
This addition ensures traffic is routed through the labeled nodes only:
```yaml
nodeSelector:
    user-type: alpha
```

### View Logs
```bash
kubectl logs <pod-name>
```

### Get All Resources
```bash
kubectl get all
```

### Describe a Pod
```bash
kubectl describe pod <pod-name>
```

### Delete a Resource
```bash
kubectl delete <resource-type> <resource-name>
```

### Scale a Deployment
```bash
kubectl scale deployment <deployment-name> --replicas=<number-of-replicas>
```

### Execute a Command in a Pod
```bash
kubectl exec -it <pod-name> -- <command>
```

### Port Forward a Pod
```bash
kubectl port-forward <pod-name> <local-port>:<pod-port>
```

### Check Cluster Nodes
```bash
kubectl get nodes
```

### Get Events
```bash
kubectl get events --sort-by='.metadata.creationTimestamp'
```

### Apply Changes to a Resource
```bash
kubectl apply -f <file-name>.yaml
```

### Debug a Pod
```bash
kubectl exec -it <pod-name> -- /bin/sh
```

### View Resource Usage
```bash
kubectl top pod
kubectl top node
```