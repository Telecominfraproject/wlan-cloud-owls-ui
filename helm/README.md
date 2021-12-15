# owlsui

This Helm chart helps to deploy OpenWIFI Load Simulator Web UI (further on refered as __LoadSim UI__) to the Kubernetes clusters. It is mainly used in [assembly chart](https://github.com/Telecominfraproject/wlan-cloud-ucentral-deploy/tree/main/chart) as LoadSim UI requires other services as dependencies that are considered in that Helm chart. This chart is purposed to define deployment logic close to the application code itself and define default values that could be overriden during deployment.


## TL;DR;

```bash
$ helm install .
```

## Introduction

This chart bootstraps the LoadSim UI on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.

## Installing the Chart

Currently this chart is not assembled in charts archives, so [helm-git](https://github.com/aslafy-z/helm-git) is required for remote the installation

To install the chart with the release name `my-release`:

```bash
$ helm install --name my-release git+https://github.com/Telecominfraproject/wlan-cloud-ucentralgw-ui@helm/owlsui-0.1.0.tgz?ref=main
```

The command deploys the LoadSim UI on the Kubernetes cluster in the default configuration. The [configuration](#configuration) section lists the parameters that can be configured during installation.

> **Tip**: List all releases using `helm list`

## Uninstalling the Chart

To uninstall/delete the `my-release` deployment:

```bash
$ helm delete my-release
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Configuration

The following table lists the configurable parameters of the chart and their default values. If Default value is not listed in the table, please refer to the [Values](values.yaml) files for details.

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| replicaCount | number | Amount of replicas to be deployed | `1` |
| nameOverride | string | Override to be used for application deployment |  |
| fullnameOverride | string | Override to be used for application deployment (has priority over nameOverride) |  |
| images.owlsui.repository | string | Docker image repository |  |
| images.owlsui.tag | string | Docker image tag | `'master'` |
| images.owlsui.pullPolicy | string | Docker image pull policy | `'Always'` |
| services.owlsui.type | string | OpenWIFI LoadSim UI service type | `'ClusterIP'` |
| services.owlsui.ports.http.servicePort | number | Websocket endpoint port to be exposed on service | `80` |
| services.owlsui.ports.http.targetPort | number | Websocket endpoint port to be targeted by service | `80` |
| services.owlsui.ports.http.protocol | string | Websocket endpoint protocol | `'TCP'` |
| checks.owlsui.liveness.httpGet.path | string | Liveness check path to be used | `'/'` |
| checks.owlsui.liveness.httpGet.port | number | Liveness check port to be used (should be pointint to ALB endpoint) | `http` |
| checks.owlsui.readiness.httpGet.path | string | Readiness check path to be used | `'/'` |
| checks.owlsui.readiness.httpGet.port | number | Readiness check port to be used | `http` |
| ingresses.default.enabled | boolean | Defines if the LoadSim UI should be exposed via Ingress controller | `False` |
| ingresses.default.hosts | array | List of hosts for the exposed LoadSim UI |  |
| ingresses.default.paths | array | List of paths to be exposed for the LoadSim UI |  |
| public_env_variables | hash | Defines list of environment variables to be passed to the LoadSim UI (required for application configuration) | |


Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`. For example,

```bash
$ helm install --name my-release \
  --set replicaCount=1 \
    .
```

The above command sets that only 1 instance of your app should be running

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,

```bash
$ helm install --name my-release -f values.yaml .
```

> **Tip**: You can use the default [values.yaml](values.yaml) as a base for customization.
