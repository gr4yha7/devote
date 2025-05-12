#!/bin/sh
# Script to copy contract ABIs to frontend
mkdir -p frontend/contracts/abis
cp -r contracts/out/*/*.json frontend/contracts/abis/