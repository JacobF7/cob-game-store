import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { isAuthenticated, User } from "./user.model";
import { Plugins } from "@capacitor/core";
import { Router } from "@angular/router";

const { Storage } = Plugins;

const USER_STORAGE_KEY = "user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  apiKey = environment.apiKey;

  private _user = new BehaviorSubject<User>(null);

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<User> {
    return this.httpClient
      .post<User>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`, {
        email: username,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        tap((user) => {
          const expiresInMilliseconds = +user.expiresIn * 1000;
          user.expiryDate = Date.now() + expiresInMilliseconds;
          this._user.next(user);
          this.addUserToStorage(user);
        })
      );
  }

  register(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`, {
      email: username,
      password: password,
      returnSecureToken: true,
    });
  }

  get user(): Observable<User> {
    return this._user.asObservable().pipe(
      switchMap((user) => {
        if (user) {
          return of(user);
        } else {
          return this.getUserFromStorage();
        }
      })
    );
  }

  get authenticated(): Observable<boolean> {
    return this.user.pipe(map((user) => isAuthenticated(user)));
  }

  get token(): Observable<string> {
    return this.user.pipe(map((user) => user.idToken));
  }

  addUserToStorage(user: User) {
    if (user) {
      Storage.set({ key: USER_STORAGE_KEY, value: JSON.stringify(user) }).then(() =>
        console.log("Added user to storage")
      );
    }
  }

  getUserFromStorage(): Promise<User> {
    return Storage.get({ key: USER_STORAGE_KEY }).then((user) => {
      if (user.value) {
        return JSON.parse(user.value) as User;
      } else {
        return null;
      }
    });
  }

  logout() {
    Storage.remove({ key: USER_STORAGE_KEY }).then(() => {
      this.router.navigate(["/", "auth"]);
      this._user.next(null);
    });
  }
}
