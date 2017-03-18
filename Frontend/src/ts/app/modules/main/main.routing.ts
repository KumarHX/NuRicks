// Angular imports
import { ModuleWithProviders }      from "@angular/core";
import { Routes, RouterModule }     from "@angular/router";

// Custom imports
import { MainComponent }            from "./main/main.component";

// Store a constant of the routes used in this app
const appRoutes: Routes = [
    { path: "", component: MainComponent }
];

// Export the routes
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
