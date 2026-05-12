import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserRoutingModule } from './user-routing-module';
import { PinEntry } from './pin-entry/pin-entry';
import { Register } from './register/register';
import { Question } from './question/question';
import { Result } from './result/result';

@NgModule({
  declarations: [PinEntry, Register, Question, Result],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, UserRoutingModule]
})
export class UserModule {}
