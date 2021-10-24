import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {User} from "../../shared/user.model";
import {AuthService} from "../../shared/auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  user!: User;
  password!: string;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.user = new User();
  }

  onSignup(form: NgForm) {
    this.authService.signup(form.value.name, form.value.email, form.value.password).subscribe(() => {
      this.authService.login(form.value.email, form.value.password).subscribe(() => {
        this.router.navigateByUrl("/");
      })
    })
  }

}
