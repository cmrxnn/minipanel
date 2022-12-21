import React from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { ActivityLog } from '@definitions/user';
import ActivityLogMetaButton from '@/components/elements/activity/ActivityLogMetaButton';
import { FolderOpenIcon, TerminalIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import style from './style.module.css';
import Avatar from '@/components/Avatar';
import useLocationHash from '@/plugins/useLocationHash';

interface Props {
    activity: ActivityLog;
    children?: React.ReactNode;
}

export default ({ activity, children }: Props) => {
    const { pathTo } = useLocationHash();
    const actor = activity.relationships.actor;

    return (
        <div className={'grid grid-cols-10 py-4 border-b-2 border-gray-800 last:rounded-b last:border-0 group'}>
            <div className={'hidden sm:flex sm:col-span-1 items-center justify-center select-none'}>
                <div className={'flex items-center w-10 h-10 rounded-full bg-gray-600 overflow-hidden'}>
                    <Avatar name={actor?.uuid || 'system'} />
                </div>
            </div>
            <div className={'col-span-10 sm:col-span-9 flex'}>
                <div className={'flex-1 px-4 sm:px-0'}>
                    <div className={'flex items-center text-gray-50'}>
                        <Tooltip placement={'top'} content={actor?.email || 'System User'}>
                            <span>{actor?.username || 'System'}</span>
                        </Tooltip>
                        <span className={'text-gray-400'}>&nbsp;&mdash;&nbsp;</span>
                        <Link
                            to={`#${pathTo({ event: activity.event })}`}
                            className={'transition-colors duration-75 active:text-cyan-400 hover:text-cyan-400'}
                        >
                            {activity.event}
                        </Link>
                        <div className={classNames(style.icons, 'group-hover:text-gray-300')}>
                            {activity.isApi && (
                                <Tooltip placement={'top'} content={'Using API Key'}>
                                    <TerminalIcon />
                                </Tooltip>
                            )}
                            {activity.event.startsWith('server:sftp.') && (
                                <Tooltip placement={'top'} content={'Using SFTP'}>
                                    <FolderOpenIcon />
                                </Tooltip>
                            )}
                            {children}
                        </div>
                    </div>
                    <p className={style.description}>{activity.event.replace(':', '.')}</p>
                    <div className={'mt-1 flex items-center text-sm'}>
                        {activity.ip && (
                            <span>
                                {activity.ip}
                                <span className={'text-gray-400'}>&nbsp;|&nbsp;</span>
                            </span>
                        )}
                        <Tooltip placement={'right'} content={format(activity.timestamp, 'MMM do, yyyy H:mm:ss')}>
                            <span>{formatDistanceToNowStrict(activity.timestamp, { addSuffix: true })}</span>
                        </Tooltip>
                    </div>
                </div>
                {activity.hasAdditionalMetadata && <ActivityLogMetaButton meta={activity.properties} />}
            </div>
        </div>
    );
};
