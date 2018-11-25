[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

# Amazfit Watchfaces JAR library Generator
A generator to simplify the creation of `HuamiWatchFaces2.jar` needed for creating Amazfit APK Watchfaces.

## Prerequisite
1. `adb` (Android Debug Bridge)
2. `java`

## Instruction:
1. Connect Amazfit Stratos to your computer
2. Open `afwf-jar-lib-generator` (Downloaded from [release](https://github.com/amoshydra/afwf-jar-lib-generator/releases/latest))
3. Look for `./output/HuamiWatchFaces2.jar`

## What does this do?
This generators will run 5 topic of tasks (see: [/index.js](https://github.com/amoshydra/afwf-jar-lib-generator/blob/master/index.js#L8-L14))
1. Initialize
2. Get dependencies
    - Download the necessary tools and assets for the generation process (oat2dex, dex-tools, old-watchfaces apk)
3. Generate JAR file from the odex obtained from your smartwatch
4. Generate JAR file from the old watchfaces file
5. Repack and create `HuamiWatchFaces2.jar`

## Running from source
The executable is bundled using nexe. The underlying logic of the script is written in JavaScript for nodejs. If you want, it can also be executed using node  

```shell
yarn install
node .
```

## Notes:
1. This script follow the steps provided by https://github.com/RavenLiquid/amazfit-watchfaces#prerequisites
2. This script should work for Amazfit Pace too (but it has only been tested with Stratos as of now)  
3. As of now, the release contains executable for Windows only. A pull request is welcomed to support other machine.

## Resources:
1. https://forum.xda-developers.com/smartwatch/amazfit/project-huamiwatchfaces-based-custom-t3760814
2. https://github.com/RavenLiquid/amazfit-watchfaces
3. https://github.com/Nxsaul/AmazfitAPKs

