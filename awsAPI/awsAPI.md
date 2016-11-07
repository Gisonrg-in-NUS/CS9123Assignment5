## Subscribe Emails

POST: `https://20eo7wu2fg.execute-api.ap-southeast-1.amazonaws.com/dev/subscribeEmails`
Parameter:

```json
{"repo": "owner/repo", "emails": [email1, email2, .. emailn]}
```

Response:

```json
{"message": "Success"}
```

Failures:

```
{'message': 'Please check your request format.'}, 400
```

## Update Time

POST: `https://20eo7wu2fg.execute-api.ap-southeast-1.amazonaws.com/dev/updateTime`
Parameter:

```json
{"repo": "owner/repo", "timestamp": integer represents the unix timestamp}
```

Response:

```json
{"message": "Success"}
```

Failures:

```
{'message': 'Please check your request format.'}, 400
```

## Unsubscribe Email

POST: `https://20eo7wu2fg.execute-api.ap-southeast-1.amazonaws.com/dev/unsubscribeEmail`
Parameter:

```json
{"value": a hashed value}
```

Response:

```json
{"message": "Success"}
```

Failures:

```
{'message': 'Please check your request format.'}, 400
```