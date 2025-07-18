import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @Output() sendLoginForm = new EventEmitter<void>();
  public form: FormGroup;
  public email = '';
  public password = '';

  constructor(private authService: AuthService, private toastr: ToastrService){}

  public ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(this.email, [Validators.required, Validators.email]),
      password: new FormControl(this.password, [Validators.required])
    });
  }

  public login(): void {
    if (this.form.valid) {
      this.authService.login(this.form.value.email, this.form.value.password).subscribe((resp: any) => {
        if (resp?.name){
          this.sendLoginForm.emit();
        }
      },
      (error: any) =>{
        console.log(error);
        this.toastr.warning(error.error.message)
      });
    }
  }
}