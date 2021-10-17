import { NgModule } from '@angular/core';
import { UserExtractPipe } from './custom.pipe';

@NgModule({
declarations: [UserExtractPipe],
imports: [],
exports: [UserExtractPipe],
})

export class PipesModule {}