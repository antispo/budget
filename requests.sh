#!/bin/bash
# curl -H "Content-Type: application/json" -X POST -d '{ "name": "ynab" }' http://localhost:3001/api/budget

#BID="5df32c54383dbe4ccf4c903e"
BID="5df2468b0fbf700f3df20683"

HH="Content-Type: application/json"
WR="curl -s"
BAPI=http://localhost:3001/api
B=budget
BS=${B}s
A=account
AS=${A}s
C=category
CS=categories
P=payee
PS=${P}s


function get_budgets {
	$WR $BAPI/$BS
}

function get_budget {
	$WR $BAPI/$B/$BID
}

function get_accounts {
	$WR $BAPI/$AS/$BID
}

function add_account {
	$WR -X POST -H "${HH}" -d "{ \"budgetId\": \"${BID}\", \"name\": \"${1}\", \"balance\": 0 }" $BAPI/$A/
}

function delete_account {
	$WR -X DELETE $BAPI/$A/${1}
}

function get_categories {
	$WR $BAPI/$CS/${BID}
}

function add_category {
	$WR -X POST -H "${HH}" -d "{ \"budgetId\": \"${BID}\", \"name\": \"${1}\" }" $BAPI/$C
}

function delete_category {
	$WR -X DELETE $BAPI/$C/${1}
}

function get_payees {
	$WR $BAPI/$PS/${BID}
}
function add_payee {
	$WR -X POST -H "${HH}" -d "{ \"budgetId\": \"${BID}\", \"name\": \"${1}\" }" $BAPI/$P
}
function delete_payee {
	$WR -X DELETE $BAPI/$P/${1}
}
