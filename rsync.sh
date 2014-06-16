#!/bin/bash
#ssh ${SSH_USER}:${SSH_PASS}@ns368978.ovh.net
#rsync -avz --delete -e ssh . "${SSH_USER}:${SSH_PASS}@ns368978.ovh.net:/var/www/vhosts/chatanoo.org/projects/handicap/admin/prod/" --exclude-from 'rsync.exclude'
rsync -avz --delete -e ssh . "root@ns368978.ovh.net:/var/www/vhosts/chatanoo.org/projects/handicap/admin/prod/" --exclude-from 'rsync.exclude'