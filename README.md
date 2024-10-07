# Okibro

It was a web application designed to help learn English. It was built using React, Nest.js, PostgreSQL, and utilized the ChatGPD API to generate lessons. It was deployed on AWS, but it's no longer supported, so I decided to just share its code.

# Development installation

1. Go to the folder ./web and follow README.md instruction.

2. Go to the folder ./api and follow README.md instruction.

Don't touch nginx folder, only api and web are needed.

# Production installation

1. Ask me about .env file and put in in the root.

2. Fix web .env.production to:

```
REACT_APP_API_URL=http://localhost:80/api/
```

Don't forget to return it to previous state then.

3. Start building:

```
docker-compose up
```

Look [here](http://localhost:80/)
