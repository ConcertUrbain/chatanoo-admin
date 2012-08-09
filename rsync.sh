#!/bin/bash
rsync -avz --delete -e ssh . "root@ns368978.ovh.net:/var/www/vhosts/chatanoo.org/projects/handicap/admin/prod/" --exclude-from 'rsync.exclude'