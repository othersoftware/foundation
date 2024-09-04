# About

This package allows to create a bridge between backend written with Laravel
and a single page application written in Vue.

## Concept

This package is very similar to Inertia.js, meaning you can keep working
on your application within a monolithic architecture, using a traditional MVC
approach, which allows to keep your codebase tidy and organized.

On the frontend we have a Vue framework with its all functionalities
available, to build a super powerful SPA. The package and its plugins
are designed in a such way to make it feel like we're simply replacing
Blade with a Vue.

## Why not to use Inertia then?

Since Inertia is feature complete in its basic concept, creating a bridge
between Laravel and Vue/React/Svelte, it is still missing a lot of
functionalities which are requested for a very long time by the community,
but have never been implemented, and probably will never be.

Some features we've implemented require changes deep inside the core
of Laravel, meaning they won't be implemented quickly, or would never
be implemented. Inertia is also not tightly coupled with Laravel only.
It was created with other frameworks in mind, which means it would be
incredibly hard to implement some of those features across all frameworks
Inertia supports.

We, as a company, cannot wait that long, as we have to go forward with big
projects, so we're creating our own implementation, tightly coupled with
the stack we use: Laravel and Vue.
