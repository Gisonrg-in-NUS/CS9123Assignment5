## Init

GET: `https://cs9123a5.saki.sshz.org/init/CNA-Bld/EOPlugins`

Response:

```json
{"message": "OK. Come back later.", "repo": "CNA-Bld/EOPlugins"}
```

Failures:

```
{'message': 'Not a valid GitHub repo.'}, 400
```

## File History

GET: `https://cs9123a5.saki.sshz.org/file/CNA-Bld/EOPlugins/BrowserLocator/BrowserLocator.csproj`

Response:

```json
[
    {
        "author": "CNA-Bld",
        "commit": "3fe7e26708b064a19d9b8d84d129b218422f1ed2",
        "email": "cna.bld@gmail.com",
        "message": "Fix post build command",
        "time": "1467439096"
    },
    {
        "author": "CNA-Bld",
        "commit": "aa3048fd8b8eb25e8fac33b7d7026095566a1ea2",
        "email": "cna.bld@gmail.com",
        "message": "Implement BrowserLocator",
        "time": "1467437978"
    }
]
```

Failures:

```
{'message': 'Not a valid GitHub repo.'}, 400
{'message': 'Wait ah...'}, 202
```

## File History (Line No.)

GET: `https://cs9123a5.saki.sshz.org/file/CNA-Bld/EOPlugins/BrowserLocator/BrowserLocator.csproj?lines=1,3`

Response:

```json
[
    {
        "author": "CNA-Bld",
        "commit": "aa3048fd8b8eb25e8fac33b7d7026095566a1ea2",
        "email": "cna.bld@gmail.com",
        "message": "Implement BrowserLocator",
        "time": "1467437978"
    }
]
```

Failures:

```
{'message': 'Not a valid GitHub repo.'}, 400
{'message': 'Wait ah...'}, 202
```

## Line Count in Final Project

GET: `https://cs9123a5.saki.sshz.org/blame/CNA-Bld/EOPlugins`

Response:

```json
[
    {
        "author": "CNA-Bld",
        "email": "cna.bld@gmail.com",
        "lines": 24308
    }
]
```

Failures:

```
{'message': 'Not a valid GitHub repo.'}, 400
{'message': 'Wait ah...'}, 202
```
