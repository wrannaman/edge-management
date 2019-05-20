# Edge Management

- manages kube cluster on the edge


## API

- Sits in the cloud, edge nodes connect to it via mqtt


## APP

- UI interface to make management easier

## Edge

- Where the magic happens
- Listens over mqtt for events on what to run
- Checks in with api every x seconds
- Uses Kubernetes to manage containers to run


## Dev

Install

```sh
go get github.com/canthefason/go-watcher
```

Run

```sh
watcher
```
