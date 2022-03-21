<template>
  <div class="container">
    <div class="row mb-4">
      <div class="col">
        <h1>Dev tools</h1>
      </div>
    </div>
    <div clas="row">
      <div class="col">
        <form @submit.prevent>
          <div class="mb-3">
            <label for="json-input" class="form-label">Json Object</label>
            <textarea
              v-model="jsonText"
              class="form-control"
              rows="10"
              id="json-input"
            >
            </textarea>
          </div>
          <div class="mb-3">
            <button @click="updateUsers()" class="btn btn-primary">
              Run function
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import * as fb from "../../firebase";

export default defineComponent({
  name: "dev",
  data() {
    return {
      jsonText: `[
{ "username": "rootUser", "email": "rootuser@fakemail3424577.com", "parent": null, "childLeft": "PitGtr", "childRight": "test_user", "nickname": "Root User", "rank": "GAL-SENATE", "enroller": null, "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-06-03T15:23:12-06:00" },
{ "username": "PitGtr", "email": "pitgtr@fakemail3424577.com", "parent": "rootUser", "childLeft": "SaulDiamante", "childRight": "marmendoza", "nickname": "Pedro Savala", "rank": "GAL-SENATE", "enroller": "rootUser", "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-03-07T12:23:11-06:00" },
{ "username": "SaulDiamante", "email": "sauldiamante@fakemail3424577.com", "parent": "PitGtr", "childLeft": "bsilva", "childRight": "FridaMillonaria", "nickname": "Saul Flores", "rank": "GAL-SENATE", "enroller": "PitGtr", "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-03-12T09:13:23-06:00" },
{ "username": "bsilva", "email": "bsilva@fakemail3424577.com", "parent": "SaulDiamante", "childLeft": "javiermeza", "childRight": "kevinhdz", "nickname": "A Silva", "rank": "GAL-REPUBLIC", "enroller": "SaulDiamante", "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-02-18T16:23:34-06:00" },
{ "username": "javiermeza", "email": "javiermeza@fakemail3424577.com", "parent": "bsilva", "childLeft": null, "childRight": null, "nickname": "Javier Meza", "rank": "OLD-REPUBLIC", "enroller": "bsilva", "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-03-29T18:25:23-06:00" },
{ "username": "kevinhdz", "email": "kevinhdz@fakemail3424577.com", "parent": "bsilva", "childLeft": null, "childRight": null, "nickname": "Kevin Hernandez", "rank": "JEDI-ORDER", "enroller": "bsilva", "isActive": false, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-01-31T17:15:56-06:00" },
{ "username": "FridaMillonaria", "email": "fridamillonaria@fakemail3424577.com", "parent": "SaulDiamante", "childLeft": "carmenmtz", "childRight": "baezm", "nickname": "Frida Millonaria", "rank": "JEDI-ORDER", "enroller": "SaulDiamante", "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-03-10T00:35:22-06:00" },
{ "username": "carmenmtz", "email": "carmenmtz@fakemail3424577.com", "parent": "FridaMillonaria", "childLeft": null, "childRight": null, "nickname": "Carmen Martinez", "rank": "JEDI", "enroller": "FridaMillonaria", "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-03-14T01:43:23-06:00" },
{ "username": "baezm", "email": "baezm@fakemail3424577.com", "parent": "FridaMillonaria", "childLeft": null, "childRight": null, "nickname": "Mariana Baez", "rank": "OLD-REPUBLIC", "enroller": "FridaMillonaria", "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-04-01T19:12:23-06:00" },
{ "username": "marmendoza", "email": "marmendoza@fakemail3424577.com", "parent": "PitGtr", "childLeft": "cracksantander", "childRight": "carlosl", "nickname": "Marcela Mendoza", "rank": "GAL-REPUBLIC", "enroller": "PitGtr", "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-03-26T13:15:30-06:00" },
{ "username": "cracksantander", "email": "cracksantander@fakemail3424577.com", "parent": "marmendoza", "childLeft": "moonleia", "childRight": "danilopez", "nickname": "Jose Santander", "rank": "JEDI", "enroller": "marmendoza", "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-03-28T14:55:23-06:00" },
{ "username": "moonleia", "email": "moonleia@fakemail3424577.com", "parent": "cracksantander", "childLeft": null, "childRight": null, "nickname": "Leia Moonwalker", "rank": "JEDI-ORDER", "enroller": "cracksantander", "isActive": false, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-02-12T19:12:52-06:00" },
{ "username": "danilopez", "email": "danilopez@fakemail3424577.com", "parent": "cracksantander", "childLeft": null, "childRight": null, "nickname": "Daniela Lopez", "rank": "OLD-REPUBLIC", "enroller": "cracksantander", "isActive": false, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-02-05T19:12:15-06:00" },
{ "username": "carlosl", "email": "carlosl@fakemail3424577.com", "parent": "marmendoza", "childLeft": "joseluisrubi", "childRight": "lmoonwalker", "nickname": "Carlos Lopez", "rank": "GAL-REPUBLIC", "enroller": "marmendoza", "isActive": false, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-02-11T20:45:53-06:00" },
{ "username": "joseluisrubi", "email": "joseluisrubi@fakemail3424577.com", "parent": "carlosl", "childLeft": null, "childRight": null, "nickname": "Jose Luis  R", "rank": "OLD-REPUBLIC", "enroller": "carlosl", "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-03-26T21:15:45-06:00" },
{ "username": "lmoonwalker", "email": "lmoonwalker@fakemail3424577.com", "parent": "carlosl", "childLeft": null, "childRight": null, "nickname": "Luke Moonwalker", "rank": "JEDI-ORDER", "enroller": "carlosl", "isActive": true, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-03-27T23:23:23-06:00" },
{ "username": "test_user", "email": "user375@usermail.com", "parent": "rootUser", "childLeft": null, "childRight": null, "nickname": "Test User", "rank": "OLD-REPUBLIC", "enroller": "rootUser", "isActive": false, "pictureUrl": null, "points": { "left": { "paid": 0, "pending": 0 }, "right": { "paid": 0, "pending": 0} }, "subscriptionExpiration": "2021-02-02T21:21:15-06:00" }
]`
    };
  },
  methods: {
    updateUsers() {
      //console.log(JSON.parse(this.jsonText.toString()));
      const callFunc = fb.func.httpsCallable("");
      callFunc()
        .then((data) => {
          console.log(data);
          alert("Yes!! " + data);
        })
        .catch((error) => {
          console.log("Error: " + error);
          alert(error);
        });
      // const getProviders = fb.func.httpsCallable("getProviders");
      // getProviders().then((r) => {
      //   console.log(r);
      // });
    }
  }
});
</script>
