# QuestBook Subgraph

The subgraph for the QuestBook platform. We use the graph to collect index events from our smart contract to make data from them quick to access. Our graph is currently hosted on our own private `graph-node`.

See [here](https://thegraph.com/en/) if you don't know what the graph is.

## Running Locally

1. Clone the repo
2. Run `yarn`
3. Run a graph node locally, see [here](https://github.com/graphprotocol/graph-node/tree/master/docker) on how to do that. Simplest method would be to run a local graph node on Docker.
4. We use mustache to template the subgraph yaml, in order to reduce repeating ourselves when deploying to dfferent networks. To prepare the subgraph yaml for deployment on a network, run `yarn prepare-{network}`.
	- Eg. to prepare for deployment on Rinkeby -- run `yarn prepare-rinkeby`
4. Finally to deploy on your local graph node, run `yarn deploy-local`

## Running Tests

1. Apart from cloning the repository & installing the dependies via yarn, you'll need to install postgres on your system. Refer [here](https://www.postgresql.org/download/).
2. Postgres is required by the "matchstick" library (testing lib for the graph) to enable building mock databases to run tests against
3. Once postgres is installed -- run `yarn test`

## Prerequisites for Contributing

1. Familiarity with Typescript (assemblyscript ideally)
2. Some familiarity with GraphQL
3. Some familiarity with what smart contracts are, what an ABI is, other general web3 lingo
4. If this is the first graph you'll be contributing to, would recommend building a sample subgraph first. Refer [here](https://thegraph.com/docs/en/developer/create-subgraph-hosted/) for the same.