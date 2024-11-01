import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioComponent } from './inicio/inicio.component';
import { VoiceRecordComponent } from './voice-record/voice-record.component';
import { RegisterComponent } from './register/register.component';
import { Pagina404Component } from './pagina404/pagina404.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = 
[
    {
        path:'',redirectTo: '/inicio', pathMatch: 'full'
    },
    {
        path:'inicio',
        component: InicioComponent
    },
    {
        path:'home',
        component: VoiceRecordComponent
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'pagina404',
        component:Pagina404Component
    },
    {
        path:'**',
        redirectTo:'pagina404'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }