# Public Android release process

No APK or update manifest is published by this website foundation.

## Before a release is public
1. Confirm the release commit and version/build.
2. Run the app's analyze and test gates and build the release APK.
3. Validate installation and update over a previously signed build on the supported Android path.
4. Confirm the production signing identity is unchanged and the APK is not a debug build.
5. Compute SHA-256 from the exact final APK.
6. Upload the APK to the separate public release-asset location and verify anonymous download access.
7. Publish the update manifest with exact version, build, minimum supported build, APK URL, checksum, and release notes.
8. Verify redirect handling and download-host allowlisting against the mobile updater. Do not weaken host checks merely to allow a redirect.
9. Match website version, build, checksum, release date, and changelog to the actual binary.
10. Test download, checksum validation, and Android installer confirmation on real hardware.
11. Only then enable the official download link and publish the changelog entry.

## Non-negotiable rules
- Keep app source separate from public binary distribution.
- Never publish signing keys, Supabase service-role keys, customer data, or production credentials.
- Do not claim silent installation; Android's normal installer requires user confirmation.
- Do not call an unmerged branch, local build, or draft APK a public release.
- Never publish placeholder URLs or a fabricated checksum.
