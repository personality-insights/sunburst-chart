/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

class PersonalityProfile {

  constructor(profile) {
    this._traits = profile.personality;
    this._needs = profile.needs;
    this._values = profile.values;
  }

  traits(){
    return this._traits.map(function(t) {
      return {
        id: t.trait_id,
        name: t.name,
        category: t.category,
        score: t.percentile,
        facets: t.children.map(function(f) {
          return {
            id: f.trait_id,
            name: f.name,
            category: f.category,
            score: f.percentile
          };
        })
      };
    });
  }

  needs() {
    return this._needs.map(function(n) {
      return {
        id: n.trait_id,
        name: n.name,
        category: n.category,
        score: n.percentile
      };
    });
  }

  values() {
    return this._values.map(function(v) {
      return {
        id: v.trait_id,
        name: v.name,
        category: v.category,
        score: v.percentile
      };
    });
  }

}

module.exports = PersonalityProfile;
