import type { Component } from "vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

type ComponentImport = () => Promise<{ default: Component }>;

/**
 * Step 1
 * Lazy improt all files from \@/pages
 * @returns ComponentImport
 */
const modules = import.meta.glob("../../pages/**/*.vue");

/**
 * Step 2
 * Convert file path to router path
 * @param file - File path
 * @returns Router path
 */
function pathFromFile(file: string): string {
    let path = file.replace(/^\..\/..\/pages|\.vue$/g, "");
    path = path.replace(/\[\.\.\.(.+?)\]/g, ":$1(.*)*"); // [...slug] → :slug(.*)*
    path = path.replace(/\[(.+?)\]/g, ":$1"); // [id] → :id
    path = path.replace(/\/index$/, "/"); // /user/index -> /user/
    path = path.replace(/^\/index$/, "/"); // /index -> /
    return path;
}

/**
 * Step 3
 * Create router routes from modules
 * @returns RouteRecordRaw[]
 */
const routes: RouteRecordRaw[] = Object.keys(modules).map((file) => ({
    path: pathFromFile(file),
    component: modules[file] as ComponentImport,
}));

/**
 * Step 4
 * Auto regist 404 route (if /404.vue exists)
 */
const notFound = Object.keys(modules).find((f) => f.includes("/404.vue"));
if (notFound) {
    routes.push({
        path: "/:pathMatch(.*)*",
        component: modules[notFound] as ComponentImport,
    });
}

/**
 * Step 5
 * Create router instance
 * @returns Router instance
 */
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
