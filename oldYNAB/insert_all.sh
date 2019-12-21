#!/bin/bash

source 'requests.sh'

echo 'db.accounts.deleteMany({}); db.payees.deleteMany({}); db.categories.deleteMany({}); db.transactions.deleteMany({});' | mongo oldYNAB

./insert_payees.sh
./insert_categories.sh
./insert_accounts.sh
echo -e "#!/bin/bash\nsource 'requests.sh'" > insert_transactions.sh
./insert.sh >> insert_transactions.sh
./insert_transactions.sh