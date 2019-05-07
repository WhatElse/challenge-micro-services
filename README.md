## Challenge connected services

### Prerequisites
- Build your own `.env` file to run the project. You can take `env.example` as example.
- `docker-compose` installed locally

### Run the project

```
docker-compose
```

### Test it

Post a message on `http://localhost:3000/api/message`.<br>
Curl example :
```
curl -X POST \
  http://localhost:3000/api/message \
  -H 'Content-Type: application/json' \
  -d '{
	"topic": "general",
	"message": "my message"
}'
```

You should receive an incoming message (`message` payload's property) on a channel (`topic` payload's property) in Slack.
Furthermore you will receive an email. To see it go on `http://localhost:1080`.<br>

Happy testing :)


