#!/usr/bin/env bash
sudo apt install mono-complete rpm ffmpeg wavpack libsox-fmt-all sox shntool mp3splt libav-tools fakeroot
sudo ln -s /usr/bin/ffmpeg /usr/local/bin/ffmpeg || true
sudo ln -s /usr/bin/ffprobe /usr/local/bin/ffprobe || true
