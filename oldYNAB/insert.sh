#!/bin/bash

source "requests.sh"

OLDIFS=$IFS
IFS=,
while read date payee accountFrom accountTo category ammount kk
do
    payeeId=$(get_payees | jq | grep -C 3 "$payee" | grep _id | cut -d: -f2 | sed -e 's/ "//' -e 's/",//')
    if [[ ! -z $accountFrom ]]
    then
        accountIdFrom=$(get_accounts | jq | grep -w -C 3 "$accountFrom\"" | grep _id | cut -d: -f2 | sed -e 's/ "//' -e 's/",//')
    fi
    if [[ ! -z $accountTo ]]
    then
        accountIdTo=$(get_accounts | jq | grep -w -C 3 "$accountTo\"" | grep _id | cut -d: -f2 | sed -e 's/ "//' -e 's/",//')
    fi
    if [[ ! -z $category ]]
    then
        category=$(get_categories | jq | grep -w -C 3 "$category\"" | grep _id | cut -d: -f2 | sed -e 's/ "//' -e 's/",//')
    fi
    echo "curl -s -H 'Content-Type: application/json' -d '{ \"budgetId\": \"5dfdfd026a572627cc560a0f\", \"date\": \"$date\", \"payeeId\": \"$payeeId\", "\
        "\"accountIdFrom\": \"$accountIdFrom\", \"accountIdTo\": \"$accountIdTo\", "\
        "\"categoryId\": \"$categoryId\", \"ammount\": \"$ammount\", \"cleared\": \"true\" }' http://localhost:3001/api/transaction"

    unset date payee accountFrom accountTo category ammount kk payeeId accountIdFrom accountIdTo categoryId ammount
done < register
IFS=$OLDIFS