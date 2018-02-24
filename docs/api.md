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
http://sequelize.readthedocs.io/en/v3/docs/models-definition/#validations
http://docs.sequelizejs.com/manual/tutorial/models-definition.html#validations

## Tests

It is a good idea to make tests isolated and to always clean up after yourself after tests done running. For example: if you create a Thread or Forum document you must delete it in "after" function. If you don't you might run into errors because other tests manipulate Forum or Thread documents.

The only exception is when you know for sure that data you changed will not be used by any other test.

All documents from all models are automatically deleted before and after tests are done running (see: server.tests.entry.js).