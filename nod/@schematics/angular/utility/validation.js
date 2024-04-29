"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateClassName = exports.validateHtmlSelector = exports.htmlSelectorRe = void 0;
const schematics_1 = require("@angular-devkit/schematics");
// Must start with a letter, and must contain only alphanumeric characters or dashes.
// When adding a dash the segment after the dash must also start with a letter.
exports.htmlSelectorRe = /^[a-zA-Z][.0-9a-zA-Z]*(:?-[a-zA-Z][.0-9a-zA-Z]*)*$/;
// See: https://github.com/tc39/proposal-regexp-unicode-property-escapes/blob/fe6d07fad74cd0192d154966baa1e95e7cda78a1/README.md#other-examples
const ecmaIdentifierNameRegExp = /^(?:[$_\p{ID_Start}])(?:[$_\u200C\u200D\p{ID_Continue}])*$/u;
function validateHtmlSelector(selector) {
    if (selector && !exports.htmlSelectorRe.test(selector)) {
        throw new schematics_1.SchematicsException(`Selector "${selector}" is invalid.`);
    }
}
exports.validateHtmlSelector = validateHtmlSelector;
function validateClassName(className) {
    if (!ecmaIdentifierNameRegExp.test(className)) {
        throw new schematics_1.SchematicsException(`Class name "${className}" is invalid.`);
    }
}
exports.validateClassName = validateClassName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3ZhbGlkYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsMkRBQWlFO0FBRWpFLHFGQUFxRjtBQUNyRiwrRUFBK0U7QUFDbEUsUUFBQSxjQUFjLEdBQUcsb0RBQW9ELENBQUM7QUFFbkYsK0lBQStJO0FBQy9JLE1BQU0sd0JBQXdCLEdBQUcsNkRBQTZELENBQUM7QUFFL0YsU0FBZ0Isb0JBQW9CLENBQUMsUUFBZ0I7SUFDbkQsSUFBSSxRQUFRLElBQUksQ0FBQyxzQkFBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUM5QyxNQUFNLElBQUksZ0NBQW1CLENBQUMsYUFBYSxRQUFRLGVBQWUsQ0FBQyxDQUFDO0tBQ3JFO0FBQ0gsQ0FBQztBQUpELG9EQUlDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsU0FBaUI7SUFDakQsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUM3QyxNQUFNLElBQUksZ0NBQW1CLENBQUMsZUFBZSxTQUFTLGVBQWUsQ0FBQyxDQUFDO0tBQ3hFO0FBQ0gsQ0FBQztBQUpELDhDQUlDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IFNjaGVtYXRpY3NFeGNlcHRpb24gfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5cbi8vIE11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciwgYW5kIG11c3QgY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIG9yIGRhc2hlcy5cbi8vIFdoZW4gYWRkaW5nIGEgZGFzaCB0aGUgc2VnbWVudCBhZnRlciB0aGUgZGFzaCBtdXN0IGFsc28gc3RhcnQgd2l0aCBhIGxldHRlci5cbmV4cG9ydCBjb25zdCBodG1sU2VsZWN0b3JSZSA9IC9eW2EtekEtWl1bLjAtOWEtekEtWl0qKDo/LVthLXpBLVpdWy4wLTlhLXpBLVpdKikqJC87XG5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtcmVnZXhwLXVuaWNvZGUtcHJvcGVydHktZXNjYXBlcy9ibG9iL2ZlNmQwN2ZhZDc0Y2QwMTkyZDE1NDk2NmJhYTFlOTVlN2NkYTc4YTEvUkVBRE1FLm1kI290aGVyLWV4YW1wbGVzXG5jb25zdCBlY21hSWRlbnRpZmllck5hbWVSZWdFeHAgPSAvXig/OlskX1xccHtJRF9TdGFydH1dKSg/OlskX1xcdTIwMENcXHUyMDBEXFxwe0lEX0NvbnRpbnVlfV0pKiQvdTtcblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlSHRtbFNlbGVjdG9yKHNlbGVjdG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKHNlbGVjdG9yICYmICFodG1sU2VsZWN0b3JSZS50ZXN0KHNlbGVjdG9yKSkge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBTZWxlY3RvciBcIiR7c2VsZWN0b3J9XCIgaXMgaW52YWxpZC5gKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKCFlY21hSWRlbnRpZmllck5hbWVSZWdFeHAudGVzdChjbGFzc05hbWUpKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYENsYXNzIG5hbWUgXCIke2NsYXNzTmFtZX1cIiBpcyBpbnZhbGlkLmApO1xuICB9XG59XG4iXX0=