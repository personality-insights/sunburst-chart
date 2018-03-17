/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
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
const expect = require('chai').expect;

const ChartRendererV3 = require('../../src/d3-renderers/v3/personality-chart-renderer');
const ChartRendererV4 = require('../../src/d3-renderers/v4/personality-chart-renderer');

describe('D3 Renderers', () => {

  describe('Version 3', () => {
    it('should export render', () => {
      expect(ChartRendererV3.render).to.be.a('function');
    });
    it('should export d3', () => {
      expect(ChartRendererV3.d3).to.be.ok;
      expect(ChartRendererV3.d3.select).to.be.a('function');
    });
  });

  describe('Version 4', () => {
    it('should export render', () => {
      expect(ChartRendererV4.render).to.be.a('function');
    });
    it('should export d3', () => {
      expect(ChartRendererV4.d3).to.be.ok;
      expect(ChartRendererV3.d3.select).to.be.a('function');
    });
  });

});
