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
/* eslint-disable no-console */

'use strict';

class PersonalityProfile {

  constructor(profile) {
    this._traits = profile.tree.children[0].children[0];
    this._needs = profile.tree.children[1].children[0];
    this._values = profile.tree.children[2].children[0];
  }

  /**
  * Creates a tree object matching the format used by D3 tree visualizations:
  *   each node in the tree must have a 'name' and 'children' attribute except leaf nodes
  *   which only require a 'name' attribute
  **/
  d3Json(){
    return {
      tree: {
        children: [
          {
            name: 'Big 5',
            id: 'personality',
            children: [this.traitsTree()]
          },
          {
            name: 'Values',
            id: 'values',
            children: [this.valuesTree()]
          },
          {
            name: 'Needs',
            id: 'needs',
            children: [this.needsTree()]
          }
        ]
      }
    };
  }

  traitsTree(){
    return {
      name: this.traitWithHighestScore().name,
      id: this.traitWithHighestScore().id,
      category: this.traitWithHighestScore().category,
      score: this.traitWithHighestScore().percentage,
      children: this._traits.children.map(function(t) {
        return {
          name: t.name,
          id: t.id,
          category: t.category,
          score: t.percentage,
          children: t.children.map(function(f) {
            return {
              name: f.name,
              id: f.id,
              category: f.category,
              score: f.percentage
            };
          })
        };
      })
    };
  }

  needsTree(){
    return {
      name: this.needWithHighestScore().name,
      id: this.needWithHighestScore().id,
      category: this.needWithHighestScore().category,
      score: this.needWithHighestScore().percentage,
      children: this._needs.children.map(function(n) {
        return {
          name: n.name,
          id: n.id,
          category: n.category,
          score: n.percentage
        };
      })
    };
  }

  valuesTree(){
    return {
      name: this.valueWithHighestScore().name,
      id: this.valueWithHighestScore().id,
      category: this.valueWithHighestScore().category,
      score: this.valueWithHighestScore().percentage,
      children: this._values.children.map(function(v) {
        return {
          name: v.name,
          id: v.id,
          category: v.category,
          score: v.percentage
        };
      })
    };
  }

  traitWithHighestScore(){
    return this._traits;
  }

  needWithHighestScore(){
    return this._needs;
  }

  valueWithHighestScore(){
    return this._values;
  }

}

module.exports = PersonalityProfile;
