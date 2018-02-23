Validation and sanitization is done via [express-validator](https://github.com/ctavan/express-validator).

You can do validations two ways - simple and verbose. Simple one is straightforward:

```javascript
    [
        check('name', 'name is required').trim().exists().isLength({min: 5}),
        check('parentId', 'parentId is required').trim().exists().isUUID(),
    ]
```

It will always return same error defined as second parameter of check function.

Or you can checks as schema and special error for each validation:

```javascript
    parentId: {
        exists: true,
        errorMessage: 'Parent id is required',
        isUUID: {
            errorMessage: 'Parent id is not valid UUID',
        },
    },
    name: {
        exists: true,
        errorMessage: 'Name is required',
        isLength: {
            options: { min: 5, max: 100 },
            errorMessage: 'Name must be between 5 and 100 characters long',
        },
    },
```


TODO: write about validation errors.