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
    this.profile = profile.tree;
    this._traits = profile.tree.children[0].children[0];
    this._needs = profile.tree.children[1].children[0];
    this._values = profile.tree.children[2].children[0];
    this._behaviors = profile.tree.children[3] ? profile.tree.children[3].children[0] : {};
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
          },
          {
            name: 'Social Behavior',
            id: 'sbh',
            children: [this.behaviorsTree()]
          }
        ]
      }
    };
  }

  traitsTree(){
    return {
      name: this.traitWithHighestpercentage().name,
      id: this.traitWithHighestpercentage().id,
      category: this.traitWithHighestpercentage().category,
      percentage: this.traitWithHighestpercentage().percentage,
      children: this._traits.children.map(function(t) {
        return {
          name: t.name,
          id: t.id,
          category: t.category,
          percentage: t.percentage,
          children: t.children.map(function(f) {
            return {
              name: f.name,
              id: f.id,
              category: f.category,
              percentage: f.percentage
            };
          })
        };
      })
    };
  }


  needsTree(){
    return {
      name: this.needWithHighestpercentage().name,
      id: this.needWithHighestpercentage().id,
      category: this.needWithHighestpercentage().category,
      percentage: this.needWithHighestpercentage().percentage,
      children: this._needs.children.map(function(n) {
        return {
          name: n.name,
          id: n.id,
          category: n.category,
          percentage: n.percentage
        };
      })
    };
  }

  valuesTree(){
    return {
      name: this.valueWithHighestpercentage().name,
      id: this.valueWithHighestpercentage().id,
      category: this.valueWithHighestpercentage().category,
      percentage: this.valueWithHighestpercentage().percentage,
      children: this._values.children.map(function(v) {
        return {
          name: v.name,
          id: v.id,
          category: v.category,
          percentage: v.percentage
        };
      })
    };
  }

  behaviorsTree(){
    if (this._behaviors.children){
      return {
        name: this.behaviorWithHighestpercentage().name,
        id: this.behaviorWithHighestpercentage().id,
        category: this.behaviorWithHighestpercentage().category,
        percentage: this.behaviorWithHighestpercentage().percentage,
        children: this._behaviors.children.map(function(b) {
          return {
            name: b.name,
            id: b.id,
            category: b.category,
            percentage: b.percentage
          };
        })
      };
    } else {
      return {};
    }
  }

  traitWithHighestpercentage(){
    return this._traits;
  }

  needWithHighestpercentage(){
    return this._needs;
  }

  valueWithHighestpercentage(){
    return this._values;
  }

  behaviorWithHighestpercentage(){
    return this._behaviors;
  }


}

module.exports = PersonalityProfile;
