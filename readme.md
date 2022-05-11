# QuestBook Subgraph

The subgraph for the QuestBook platform. We use the graph to collect index events from our smart contract to make data from them quick to access. Our graph is currently hosted on our own private `graph-node`.

See [here](https://thegraph.com/en/) if you don't know what the graph is.

## Running Locally

1. Clone the repo
2. Run `yarn`
3. Run a graph node locally, see [here](https://github.com/graphprotocol/graph-node/tree/master/docker) on how to do that. Simplest method would be to run a local graph node on Docker.
4. We use mustache to template the subgraph yaml, in order to reduce repeating ourselves when deploying to dfferent networks. To prepare the subgraph yaml for deployment on a network, run `NETWORK={network} yarn prepare-subgraph`.
	- Eg. to prepare for deployment on Rinkeby -- run `NETWORK=rinkeby yarn prepare-subgraph`
5. Finally to deploy on your local graph node, run `NETWORK=rinkeby GRAPH_NODE=http://localhost:8020 yarn deploy-subgraph`
	- Note: change `GRAPH_NODE` environment variable to the graph node of your choice's admin URL. Typically this will be on port `8020`
6. To deploy multiple subgraphs at once, use the `deploy:all` script. Eg.
	- `NETWORK=all GRAPH_NODE=abcd.com yarn deploy:all`
	- `NETWORK=rinkeby,neon-devnet GRAPH_NODE=abcd.com yarn deploy:all` (deploys two subgraphs)

## Running Tests

1. Apart from cloning the repository & installing the dependies via yarn, you'll need to install postgres on your system. Refer [here](https://www.postgresql.org/download/).
2. Postgres is required by the "matchstick" library (testing lib for the graph) to enable building mock databases to run tests against
3. Once postgres is installed -- run `yarn test`

## Adding a New Chain

1. Add the chain ID to the QB [validator service](https://github.com/questbook/service-validator):
	1. Edit the openapi yaml to add the new chain ID
	2. Run `yarn generate:types`
2. Add the chain ID to the `schema.graphql` file
3. Run `yarn codegen:validators` to update the validators from the validator service with the new chain ID

## Prerequisites for Contributing

1. Familiarity with Typescript (assemblyscript ideally)
2. Some familiarity with GraphQL
3. Some familiarity with what smart contracts are, what an ABI is, other general web3 lingo
4. If this is the first graph you'll be contributing to, would recommend building a sample subgraph first. Refer [here](https://thegraph.com/docs/en/developer/create-subgraph-hosted/) for the same.