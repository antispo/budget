#!/bin/bash
# curl -H "Content-Type: application/json" -X POST -d '{ "name": "ynab" }' http://localhost:3001/api/budget

#BID="5df32c54383dbe4ccf4c903e"
#BID="5df2468b0fbf700f3df20683"
#oldYNAB
#BID="5dfdfd026a572627cc560a0f"
# 5dfdfd026a572627cc560a0f
#test
BID="5dfdfd026a572627cc560a0f"

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
T=transaction
TS=${T}s
E=entry
ES=entries

# wtf
# addaccount
# zeroooo
# zero!?!??!!
# refresh
# wtf

function add_budget {
	${WR} -X POST -H "${HH}" -d "{ \"_id\": \"${BID}\", \"name\": \"test\" }" $BAPI/$B
}

function get_budgets {
	$WR $BAPI/$BS
}

function get_budget {
	$WR $BAPI/$B/$BID
}

function get_accounts {
	eval $WR $BAPI/$AS/$BID
}

function add_account {
	$WR -X POST -H "${HH}" -d "{ \"budgetId\": \"${BID}\", \"name\": \"${1}\", \"balance\": 0 }" $BAPI/$A/
}

function delete_account {
	$WR -X DELETE $BAPI/$A/${1}
}


function get_category {
	$WR $BAPI/$C/${1}
}
function get_category_id_by_name {
	get_categories | jq | grep -C 2 "${1}" | grep id | cut -d: -f2 | sed -e 's/ "//' -e 's/",//'
}

function get_categories {
	eval $WR $BAPI/$CS/${BID}
}

function add_category {
	$WR -X POST -H "${HH}" -d "{ \"budgetId\": \"${BID}\", \"name\": \"${1}\" }" $BAPI/$C
}

function delete_category {
	$WR -X DELETE $BAPI/$C/${1}
}


function get_payees {
	eval "${WR}" $BAPI/$PS/${BID}
}
function add_payee {
	$WR -X POST -H "${HH}" -d "{ \"budgetId\": \"${BID}\", \"name\": \"${1}\" }" $BAPI/$P
}
function delete_payee {
	$WR -X DELETE $BAPI/$P/${1}
}

function get_transactions {
	$WR $BAPI/$TS/$BID
}

function add_transaction {
	eval $WR -H "${HH}" -d ${1} $BAPI/$T
}

function add_entry {
	$WR -H "${HH}" -d "{ \"budgetId\": \"${BID}\", \"year\": \"2019\", \"month\": \"11\", \"categoryId\":\"${1}\", \"budgeted\": \"${2}\" }" $BAPI/$E
}

function get_entries {
	$WR $BAPI/$ES/$BID
}

function delete_entry {
	$WR -X DELETE $BAPI/$E/${1}
}

# $WR $BAPI/$B -H "${HH}" -d "{ \"_id\": \"${BID}\", \"name\":\"Ynab\" }"
# {"success":true,"id":"5df2468b0fbf700f3df20683","message":"Budget created!"}