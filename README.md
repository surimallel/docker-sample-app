# Docker Sample App

A small web app for demonstrating how a Dockerfile turns application files into
a container image. The page is served by Python's standard-library HTTP server,
so there are no application dependencies to install.

## Build and run

Run these commands from the repository folder:

```powershell
docker build -t docker-sample-app .
docker run --rm -p 8097:8097 docker-sample-app
```

Open [http://localhost:8097](http://localhost:8097) in a browser. Stop the
container with `Ctrl+C`.

The `-p 8097:8097` option maps port 8097 on your computer to port 8097 in the
container. `EXPOSE 8097` in the Dockerfile documents the container port; it
does not publish the port by itself.

## Dockerfile instructions in this demo

- `FROM` selects the small Python base image.
- `WORKDIR` sets `/app` as the working directory for later instructions.
- `ADD` places the stylesheet in the image. For a regular file, it behaves like
  `COPY`; `ADD` can also unpack local tar archives. Prefer `COPY` for ordinary
  files unless you need one of `ADD`'s extra behaviors.
- `COPY` adds the page and server to the image.
- `RUN` creates a dedicated unprivileged user while building the image.
- `ENV` sets the server's default port.
- `USER` runs the server as that unprivileged user.
- `EXPOSE` documents port 8097, where the server listens.
- `ENTRYPOINT` starts the Python server.
- `CMD` supplies default arguments to the entrypoint. You can override them
  after the image name, for example:

  ```powershell
  docker run --rm -p 8100:8100 docker-sample-app --port 8100
  ```
