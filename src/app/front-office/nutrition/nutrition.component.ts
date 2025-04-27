import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css']
})
export class NutritionComponent {


  decodeToken() {
    let helper = new JwtHelperService();
    let decode = localStorage.getItem('token');

    if (decode) {
      let token = helper.decodeToken(decode);
      console.log(token);
      localStorage.setItem('sub', token?.sub);
      return token;
    }
    return null;
  }
  verifToken() {
    let decode = localStorage.getItem('token');
    let helper = new JwtHelperService();
    return !helper.isTokenExpired(decode);
  }
}
