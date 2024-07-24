# setup-intlc

A GitHub Action providing CLI access to [intlc](https://github.com/unsplash/intlc). Currently supports only Linux x86_64. 

## Usage

Specify any version >=0.8.0:

```yml
steps:
  - uses: unsplash/setup-intlc@v1
    with:
      version: 0.8.3
  - run: intlc --version
```
