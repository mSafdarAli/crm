import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class LookUpService {
  constructor(private http: HttpClient) { }

  public getYears() {
    const years: any[] = [];
    const currentYear = moment().year();
    for (let i = 0; i < 15; i++) {
      years.push({ name: currentYear + i, value: currentYear + i });
    }
    return years;
  }
  public sortOrder() {
    const orders: any[] = [];
    for (let i = 1; i <= 150; i++) {
      orders.push({ name: i, value: i });
    }
    return orders;
  }
  public getdays() {
    const days: any[] = [];
    for (let i = 0; i <= 30; i++) {
      days.push({ name: i, value: i });
    }
    return days;
  }

  public increment() {
    const discount: any[] = [];
    for (let i = 1; i <= 100; i += .5) {
      discount.push({ name: i, value: i });
    }
    return discount;
  }
  public GetNoOfColours() {
    return [
      { name: '1', value: '1' },
      { name: '2', value: '2' },
      { name: '3', value: '3' },
      { name: '4', value: '4' },
      { name: '5', value: '5' },
      { name: '6', value: '6' },
      { name: '7', value: '7' },
      { name: '8', value: '8' },
      { name: '9', value: '9' },
      { name: '10', value: '10' }
    ];
  }
  public getMonths() {
    return [
      { name: 'January', value: '1' },
      { name: 'February', value: '2' },
      { name: 'March', value: '3' },
      { name: 'April', value: '4' },
      { name: 'May', value: '5' },
      { name: 'June', value: '6' },
      { name: 'July', value: '7' },
      { name: 'August', value: '8' },
      { name: 'September', value: '9' },
      { name: 'October', value: '10' },
      { name: 'November', value: '11' },
      { name: 'December', value: '12' },
    ];
  }
  public getTypes() {
    return this.http.get(environment.api + 'actionTypes/getActionListTypes').pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({
              name: e.description,
              value: e.id,
              id: e.code
            });
          });
          return DataList;
        }
        return null;
      })
    );
  }

  public getByRole(param = null) {
    return this.http.get(environment.api + 'users/getByRole/rep', { params: param }).pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({
              name: e.firstName + ' ' + e.lastName,
              value: e.id,
            });
          });
          return DataList;
        }
        return null;
      })
    );
  }
  public getPaymentTerms() {
    return this.http
      .get(environment.api + 'referenceCodes/getByType/PaymentTerms')
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({ name: e.description, value: e.id });
            });
            return DataList;
          }
          return null;
        })
      );
  }

  public getAccountTypes() {
    return this.http
      .get(environment.api + 'referenceCodes/getByType/AccountType')
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({ name: e.description, value: e.id });
            });
            return DataList;
          }
          return null;
        })
      );
  }

  public getCategories() {
    return this.http
      .get(environment.api + 'referenceCodes/getByType/ActionTypeCategory')
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({ name: e.description, value: e.id });
            });
            return DataList;
          }
          return null;
        })
      );
  }

  public getmailTemplate() {
    return this.http.get(environment.api + 'notifications').pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({ name: e.name, value: e.id });
          });
          return DataList;
        }
        return null;
      })
    );
  }

  public getRoles() {
    return this.http.get(environment.api + 'siteRoles').pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({ name: e.description, value: e.name });
          });
          return DataList;
        }
        return null;
      })
    );
  }
  public getRolesId() {
    return this.http.get(environment.api + 'siteRoles').pipe(map(res => {
      if (res['statusDescription'] == 'Ok') {
        var DataList: lookupdata[] = [];
        res['data'].map(e => {
          DataList.push({ name: e.name, value: e.id });

        });
        return DataList;
      }
      return null
    }));
  }
  public getActionTypes() {
    return this.http.get(environment.api + 'actionTypes').pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({ name: e.description, value: e.description });
          });
          return DataList;
        }
        return null;
      })
    );
  }

  public getNotifications() {
    return this.http.get(environment.api + 'notifications').pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({ name: e.name, value: e.name });
          });
          return DataList;
        }
        return null;
      })
    );
  }
  public getGroups() {
    return this.http
      .get(environment.api + 'referenceCodes/getByType/PrintPositionGroup')
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map(e => {
              DataList.push({ name: e.description, value: e.code });

            });
            return DataList;
          }
          return null
        })
      );
  }
  getProductsCategory() {
    return this.http.get(environment.api + 'productCategory').pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({ name: e.description, value: e.code });
          });
          return DataList;
        }
        return null;
      })
    );
  }

  public getCustomers(params = null) {
    return this.http.get(environment.api + 'customers', { params: params }).pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({ name: e.description, value: e.id });
          });
          return DataList;
        }
        return null;
      })
    );
  }
  public getCustomersContactData(id) {
    return this.http.get(environment.api + 'customerContacts/getByCustomerId/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public getJobTypes(params = null) {
    return this.http.get(environment.api + 'jobTypes', { params: params }).pipe(
      map((res) => {
        if (res['statusDescription'] == 'Ok') {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({ name: e.description, value: e.id });
          });
          return DataList;
        }
        return null;
      })
    );
  }

  public getDeliveryOptions() {
    return this.http
      .get(environment.api + 'extraPrices/getDeliveryOptions')
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({ name: e.description, value: e.id, id: e.price });
            });
            return DataList;
          }
          return null;
        })
      );
  }

  public getLeadTimes(params = null) {
    return this.http
      .get(environment.api + 'leadTimes', { params: params })
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({ name: e.description, value: e.id });
            });
            return DataList;
          }
          return null;
        })
      );
  }


  public getHistory() {
    return this.http
      .get(environment.api + 'taskTypes')
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({ name: e.description, value: e.id });
            });
            return DataList;
          }
          return null;
        })
      );
  }

  public getAssignTo() {
    return this.http
      .get(environment.api + 'users')
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({ name: e.firstName + ' ' + e.lastName, value: e.id });
            });
            return DataList;
          }
          return null;
        })
      );
  }
  public getSupplier(params = null) {
    return this.http
      .get(environment.api + 'suppliers', { params: params })
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({ name: e.description, value: e.id });
            });
            return DataList;
          }
          return null;
        })
      );
  }

  public getReasons(params) {
    return this.http
      .get(environment.api + 'complaintReasons', { params: params })
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({ name: e.description, value: e.id });
            });
            return DataList;
          }
          return null;
        })
      );
  }

  public getJobStatus() {
    return this.http
      .get(environment.api + 'referenceCodes/getByType/StatusCode')
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({ name: e.description, value: e.id });
            });
            return DataList;
          }
          return null;
        })
      );
  }
  public getJobTypeFromRef(params = null) {
    return this.http
      .get(environment.api + 'referenceCodes/getByType/jobtype', { params: params })
      .pipe(
        map((res) => {
          if (res['statusDescription'] == 'Ok') {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({ name: e.description, value: e.id });
            });
            return DataList;
          }
          return null;
        })
      );
  }
}

