import { Home, Friends, Message, Notifications, Profile, User, AddPosts, SignIn } from '../pages/pages.js'; 

import { Default, Single } from '../layouts/layouts.js';

const routers = [
    {path: '/', component: Home, layout: Default},
    {path: '/add-posts', component: AddPosts, layout: Default},
    {path: '/friends', component: Friends, layout: Default},
    {path: '/messages/*', component: Message, layout: Default},
    {path: '/notifications', component: Notifications, layout: Default},
    {path: '/profile', component: Profile, layout: Default},
    {path: '/user/:slug', component: User, layout: Default},
    {path: '/sign-in', component: SignIn, layout: Single},
]

export default routers;