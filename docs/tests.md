If you want to exlude file from being tested, just find special "if" statement in the end of appropriate .tests.entry.js file.


## Using "[debug](https://www.npmjs.com/package/debug)" library

I managed to make it work by using "cross-env" module to eliminate terminal inconsistencies between windows and unix operating systems.
If you can't get colorised output in terminal on windows i suggest you to use ubuntu bash on windows. You can get it by installing [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

Example using ubuntu bash on windows and any unix terminal:

`DEBUG=test,test:* yarn run watch-test`

Example using windows powershell and [cross-env](https://www.npmjs.com/package/cross-env) module:

`cross-env DEBUG=test,test:* yarn run watch-test`
