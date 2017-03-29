// Angular imports
import { ModuleWithProviders }      from "@angular/core";
import { Routes, RouterModule }     from "@angular/router";

// Custom imports
import { MainComponent }            from "./main/main.component";
import { MusicianComponent }        from "./musician/musician.component";

// Store a constant of the routes used in this app
const appRoutes: Routes = [
    { path: "", component: MainComponent },
    { path: "dashboard", component: MusicianComponent }
];

// Export the routes
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
