/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DomElementSchemaRegistry } from '../schema/dom_element_schema_registry';
import { getNsPrefix, TagContentType } from './tags';
export class HtmlTagDefinition {
    constructor({ closedByChildren, implicitNamespacePrefix, contentType = TagContentType.PARSABLE_DATA, closedByParent = false, isVoid = false, ignoreFirstLf = false, preventNamespaceInheritance = false, canSelfClose = false, } = {}) {
        this.closedByChildren = {};
        this.closedByParent = false;
        if (closedByChildren && closedByChildren.length > 0) {
            closedByChildren.forEach(tagName => this.closedByChildren[tagName] = true);
        }
        this.isVoid = isVoid;
        this.closedByParent = closedByParent || isVoid;
        this.implicitNamespacePrefix = implicitNamespacePrefix || null;
        this.contentType = contentType;
        this.ignoreFirstLf = ignoreFirstLf;
        this.preventNamespaceInheritance = preventNamespaceInheritance;
        this.canSelfClose = canSelfClose ?? isVoid;
    }
    isClosedByChild(name) {
        return this.isVoid || name.toLowerCase() in this.closedByChildren;
    }
    getContentType(prefix) {
        if (typeof this.contentType === 'object') {
            const overrideType = prefix === undefined ? undefined : this.contentType[prefix];
            return overrideType ?? this.contentType.default;
        }
        return this.contentType;
    }
}
let DEFAULT_TAG_DEFINITION;
// see https://www.w3.org/TR/html51/syntax.html#optional-tags
// This implementation does not fully conform to the HTML5 spec.
let TAG_DEFINITIONS;
export function getHtmlTagDefinition(tagName) {
    if (!TAG_DEFINITIONS) {
        DEFAULT_TAG_DEFINITION = new HtmlTagDefinition({ canSelfClose: true });
        TAG_DEFINITIONS = {
            'base': new HtmlTagDefinition({ isVoid: true }),
            'meta': new HtmlTagDefinition({ isVoid: true }),
            'area': new HtmlTagDefinition({ isVoid: true }),
            'embed': new HtmlTagDefinition({ isVoid: true }),
            'link': new HtmlTagDefinition({ isVoid: true }),
            'img': new HtmlTagDefinition({ isVoid: true }),
            'input': new HtmlTagDefinition({ isVoid: true }),
            'param': new HtmlTagDefinition({ isVoid: true }),
            'hr': new HtmlTagDefinition({ isVoid: true }),
            'br': new HtmlTagDefinition({ isVoid: true }),
            'source': new HtmlTagDefinition({ isVoid: true }),
            'track': new HtmlTagDefinition({ isVoid: true }),
            'wbr': new HtmlTagDefinition({ isVoid: true }),
            'p': new HtmlTagDefinition({
                closedByChildren: [
                    'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset',
                    'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
                    'h6', 'header', 'hgroup', 'hr', 'main', 'nav', 'ol',
                    'p', 'pre', 'section', 'table', 'ul'
                ],
                closedByParent: true
            }),
            'thead': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'] }),
            'tbody': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'], closedByParent: true }),
            'tfoot': new HtmlTagDefinition({ closedByChildren: ['tbody'], closedByParent: true }),
            'tr': new HtmlTagDefinition({ closedByChildren: ['tr'], closedByParent: true }),
            'td': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
            'th': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
            'col': new HtmlTagDefinition({ isVoid: true }),
            'svg': new HtmlTagDefinition({ implicitNamespacePrefix: 'svg' }),
            'foreignObject': new HtmlTagDefinition({
                // Usually the implicit namespace here would be redundant since it will be inherited from
                // the parent `svg`, but we have to do it for `foreignObject`, because the way the parser
                // works is that the parent node of an end tag is its own start tag which means that
                // the `preventNamespaceInheritance` on `foreignObject` would have it default to the
                // implicit namespace which is `html`, unless specified otherwise.
                implicitNamespacePrefix: 'svg',
                // We want to prevent children of foreignObject from inheriting its namespace, because
                // the point of the element is to allow nodes from other namespaces to be inserted.
                preventNamespaceInheritance: true,
            }),
            'math': new HtmlTagDefinition({ implicitNamespacePrefix: 'math' }),
            'li': new HtmlTagDefinition({ closedByChildren: ['li'], closedByParent: true }),
            'dt': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'] }),
            'dd': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'], closedByParent: true }),
            'rb': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'rt': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'rtc': new HtmlTagDefinition({ closedByChildren: ['rb', 'rtc', 'rp'], closedByParent: true }),
            'rp': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
            'optgroup': new HtmlTagDefinition({ closedByChildren: ['optgroup'], closedByParent: true }),
            'option': new HtmlTagDefinition({ closedByChildren: ['option', 'optgroup'], closedByParent: true }),
            'pre': new HtmlTagDefinition({ ignoreFirstLf: true }),
            'listing': new HtmlTagDefinition({ ignoreFirstLf: true }),
            'style': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
            'script': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
            'title': new HtmlTagDefinition({
                // The browser supports two separate `title` tags which have to use
                // a different content type: `HTMLTitleElement` and `SVGTitleElement`
                contentType: { default: TagContentType.ESCAPABLE_RAW_TEXT, svg: TagContentType.PARSABLE_DATA }
            }),
            'textarea': new HtmlTagDefinition({ contentType: TagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }),
        };
        new DomElementSchemaRegistry().allKnownElementNames().forEach(knownTagName => {
            if (!TAG_DEFINITIONS.hasOwnProperty(knownTagName) && getNsPrefix(knownTagName) === null) {
                TAG_DEFINITIONS[knownTagName] = new HtmlTagDefinition({ canSelfClose: false });
            }
        });
    }
    // We have to make both a case-sensitive and a case-insensitive lookup, because
    // HTML tag names are case insensitive, whereas some SVG tags are case sensitive.
    return TAG_DEFINITIONS[tagName] ?? TAG_DEFINITIONS[tagName.toLowerCase()] ??
        DEFAULT_TAG_DEFINITION;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF90YWdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL21sX3BhcnNlci9odG1sX3RhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFFL0UsT0FBTyxFQUFDLFdBQVcsRUFBRSxjQUFjLEVBQWdCLE1BQU0sUUFBUSxDQUFDO0FBRWxFLE1BQU0sT0FBTyxpQkFBaUI7SUFZNUIsWUFBWSxFQUNWLGdCQUFnQixFQUNoQix1QkFBdUIsRUFDdkIsV0FBVyxHQUFHLGNBQWMsQ0FBQyxhQUFhLEVBQzFDLGNBQWMsR0FBRyxLQUFLLEVBQ3RCLE1BQU0sR0FBRyxLQUFLLEVBQ2QsYUFBYSxHQUFHLEtBQUssRUFDckIsMkJBQTJCLEdBQUcsS0FBSyxFQUNuQyxZQUFZLEdBQUcsS0FBSyxNQVVsQixFQUFFO1FBN0JFLHFCQUFnQixHQUE2QixFQUFFLENBQUM7UUFJeEQsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUEwQnJCLElBQUksZ0JBQWdCLElBQUksZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuRCxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDNUU7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsSUFBSSxNQUFNLENBQUM7UUFDL0MsSUFBSSxDQUFDLHVCQUF1QixHQUFHLHVCQUF1QixJQUFJLElBQUksQ0FBQztRQUMvRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsMkJBQTJCLENBQUM7UUFDL0QsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLElBQUksTUFBTSxDQUFDO0lBQzdDLENBQUM7SUFFRCxlQUFlLENBQUMsSUFBWTtRQUMxQixPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUNwRSxDQUFDO0lBRUQsY0FBYyxDQUFDLE1BQWU7UUFDNUIsSUFBSSxPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFO1lBQ3hDLE1BQU0sWUFBWSxHQUFHLE1BQU0sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRixPQUFPLFlBQVksSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztTQUNqRDtRQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0NBQ0Y7QUFFRCxJQUFJLHNCQUEwQyxDQUFDO0FBRS9DLDZEQUE2RDtBQUM3RCxnRUFBZ0U7QUFDaEUsSUFBSSxlQUFvRCxDQUFDO0FBRXpELE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxPQUFlO0lBQ2xELElBQUksQ0FBQyxlQUFlLEVBQUU7UUFDcEIsc0JBQXNCLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLFlBQVksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ3JFLGVBQWUsR0FBRztZQUNoQixNQUFNLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM3QyxNQUFNLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM3QyxNQUFNLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM3QyxPQUFPLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM5QyxNQUFNLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM3QyxLQUFLLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM1QyxPQUFPLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM5QyxPQUFPLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM5QyxJQUFJLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUMzQyxJQUFJLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUMzQyxRQUFRLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUMvQyxPQUFPLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM5QyxLQUFLLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM1QyxHQUFHLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQztnQkFDekIsZ0JBQWdCLEVBQUU7b0JBQ2hCLFNBQVMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFJLFlBQVksRUFBRSxLQUFLLEVBQUcsSUFBSSxFQUFHLFVBQVU7b0JBQ3hFLFFBQVEsRUFBRyxNQUFNLEVBQUssSUFBSSxFQUFPLElBQUksRUFBVSxJQUFJLEVBQUksSUFBSSxFQUFHLElBQUk7b0JBQ2xFLElBQUksRUFBTyxRQUFRLEVBQUcsUUFBUSxFQUFHLElBQUksRUFBVSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUk7b0JBQ2xFLEdBQUcsRUFBUSxLQUFLLEVBQU0sU0FBUyxFQUFFLE9BQU8sRUFBTyxJQUFJO2lCQUNwRDtnQkFDRCxjQUFjLEVBQUUsSUFBSTthQUNyQixDQUFDO1lBQ0YsT0FBTyxFQUFFLElBQUksaUJBQWlCLENBQUMsRUFBQyxnQkFBZ0IsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBQyxDQUFDO1lBQ3RFLE9BQU8sRUFBRSxJQUFJLGlCQUFpQixDQUFDLEVBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBQyxDQUFDO1lBQzVGLE9BQU8sRUFBRSxJQUFJLGlCQUFpQixDQUFDLEVBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDbkYsSUFBSSxFQUFFLElBQUksaUJBQWlCLENBQUMsRUFBQyxnQkFBZ0IsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM3RSxJQUFJLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUNuRixJQUFJLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUNuRixLQUFLLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM1QyxLQUFLLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLHVCQUF1QixFQUFFLEtBQUssRUFBQyxDQUFDO1lBQzlELGVBQWUsRUFBRSxJQUFJLGlCQUFpQixDQUFDO2dCQUNyQyx5RkFBeUY7Z0JBQ3pGLHlGQUF5RjtnQkFDekYsb0ZBQW9GO2dCQUNwRixvRkFBb0Y7Z0JBQ3BGLGtFQUFrRTtnQkFDbEUsdUJBQXVCLEVBQUUsS0FBSztnQkFDOUIsc0ZBQXNGO2dCQUN0RixtRkFBbUY7Z0JBQ25GLDJCQUEyQixFQUFFLElBQUk7YUFDbEMsQ0FBQztZQUNGLE1BQU0sRUFBRSxJQUFJLGlCQUFpQixDQUFDLEVBQUMsdUJBQXVCLEVBQUUsTUFBTSxFQUFDLENBQUM7WUFDaEUsSUFBSSxFQUFFLElBQUksaUJBQWlCLENBQUMsRUFBQyxnQkFBZ0IsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUMsQ0FBQztZQUM3RSxJQUFJLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFDLENBQUM7WUFDN0QsSUFBSSxFQUFFLElBQUksaUJBQWlCLENBQUMsRUFBQyxnQkFBZ0IsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDbkYsSUFBSSxFQUFFLElBQUksaUJBQWlCLENBQ3ZCLEVBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDeEUsSUFBSSxFQUFFLElBQUksaUJBQWlCLENBQ3ZCLEVBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDeEUsS0FBSyxFQUFFLElBQUksaUJBQWlCLENBQUMsRUFBQyxnQkFBZ0IsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBQyxDQUFDO1lBQzNGLElBQUksRUFBRSxJQUFJLGlCQUFpQixDQUN2QixFQUFDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBQyxDQUFDO1lBQ3hFLFVBQVUsRUFBRSxJQUFJLGlCQUFpQixDQUFDLEVBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDekYsUUFBUSxFQUNKLElBQUksaUJBQWlCLENBQUMsRUFBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDM0YsS0FBSyxFQUFFLElBQUksaUJBQWlCLENBQUMsRUFBQyxhQUFhLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDbkQsU0FBUyxFQUFFLElBQUksaUJBQWlCLENBQUMsRUFBQyxhQUFhLEVBQUUsSUFBSSxFQUFDLENBQUM7WUFDdkQsT0FBTyxFQUFFLElBQUksaUJBQWlCLENBQUMsRUFBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLFFBQVEsRUFBQyxDQUFDO1lBQ3RFLFFBQVEsRUFBRSxJQUFJLGlCQUFpQixDQUFDLEVBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxRQUFRLEVBQUMsQ0FBQztZQUN2RSxPQUFPLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQztnQkFDN0IsbUVBQW1FO2dCQUNuRSxxRUFBcUU7Z0JBQ3JFLFdBQVcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLGNBQWMsQ0FBQyxhQUFhLEVBQUM7YUFDN0YsQ0FBQztZQUNGLFVBQVUsRUFBRSxJQUFJLGlCQUFpQixDQUM3QixFQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBQyxDQUFDO1NBQzNFLENBQUM7UUFFRixJQUFJLHdCQUF3QixFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDM0UsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLElBQUksV0FBVyxDQUFDLFlBQVksQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDdkYsZUFBZSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksaUJBQWlCLENBQUMsRUFBQyxZQUFZLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQzthQUM5RTtRQUNILENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFDRCwrRUFBK0U7SUFDL0UsaUZBQWlGO0lBQ2pGLE9BQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckUsc0JBQXNCLENBQUM7QUFDN0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RvbUVsZW1lbnRTY2hlbWFSZWdpc3RyeX0gZnJvbSAnLi4vc2NoZW1hL2RvbV9lbGVtZW50X3NjaGVtYV9yZWdpc3RyeSc7XG5cbmltcG9ydCB7Z2V0TnNQcmVmaXgsIFRhZ0NvbnRlbnRUeXBlLCBUYWdEZWZpbml0aW9ufSBmcm9tICcuL3RhZ3MnO1xuXG5leHBvcnQgY2xhc3MgSHRtbFRhZ0RlZmluaXRpb24gaW1wbGVtZW50cyBUYWdEZWZpbml0aW9uIHtcbiAgcHJpdmF0ZSBjbG9zZWRCeUNoaWxkcmVuOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcbiAgcHJpdmF0ZSBjb250ZW50VHlwZTogVGFnQ29udGVudFR5cGV8XG4gICAgICB7ZGVmYXVsdDogVGFnQ29udGVudFR5cGUsIFtuYW1lc3BhY2U6IHN0cmluZ106IFRhZ0NvbnRlbnRUeXBlfTtcblxuICBjbG9zZWRCeVBhcmVudCA9IGZhbHNlO1xuICBpbXBsaWNpdE5hbWVzcGFjZVByZWZpeDogc3RyaW5nfG51bGw7XG4gIGlzVm9pZDogYm9vbGVhbjtcbiAgaWdub3JlRmlyc3RMZjogYm9vbGVhbjtcbiAgY2FuU2VsZkNsb3NlOiBib29sZWFuO1xuICBwcmV2ZW50TmFtZXNwYWNlSW5oZXJpdGFuY2U6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIGNsb3NlZEJ5Q2hpbGRyZW4sXG4gICAgaW1wbGljaXROYW1lc3BhY2VQcmVmaXgsXG4gICAgY29udGVudFR5cGUgPSBUYWdDb250ZW50VHlwZS5QQVJTQUJMRV9EQVRBLFxuICAgIGNsb3NlZEJ5UGFyZW50ID0gZmFsc2UsXG4gICAgaXNWb2lkID0gZmFsc2UsXG4gICAgaWdub3JlRmlyc3RMZiA9IGZhbHNlLFxuICAgIHByZXZlbnROYW1lc3BhY2VJbmhlcml0YW5jZSA9IGZhbHNlLFxuICAgIGNhblNlbGZDbG9zZSA9IGZhbHNlLFxuICB9OiB7XG4gICAgY2xvc2VkQnlDaGlsZHJlbj86IHN0cmluZ1tdLFxuICAgIGNsb3NlZEJ5UGFyZW50PzogYm9vbGVhbixcbiAgICBpbXBsaWNpdE5hbWVzcGFjZVByZWZpeD86IHN0cmluZyxcbiAgICBjb250ZW50VHlwZT86IFRhZ0NvbnRlbnRUeXBlfHtkZWZhdWx0OiBUYWdDb250ZW50VHlwZSwgW25hbWVzcGFjZTogc3RyaW5nXTogVGFnQ29udGVudFR5cGV9LFxuICAgIGlzVm9pZD86IGJvb2xlYW4sXG4gICAgaWdub3JlRmlyc3RMZj86IGJvb2xlYW4sXG4gICAgcHJldmVudE5hbWVzcGFjZUluaGVyaXRhbmNlPzogYm9vbGVhbixcbiAgICBjYW5TZWxmQ2xvc2U/OiBib29sZWFuXG4gIH0gPSB7fSkge1xuICAgIGlmIChjbG9zZWRCeUNoaWxkcmVuICYmIGNsb3NlZEJ5Q2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgY2xvc2VkQnlDaGlsZHJlbi5mb3JFYWNoKHRhZ05hbWUgPT4gdGhpcy5jbG9zZWRCeUNoaWxkcmVuW3RhZ05hbWVdID0gdHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMuaXNWb2lkID0gaXNWb2lkO1xuICAgIHRoaXMuY2xvc2VkQnlQYXJlbnQgPSBjbG9zZWRCeVBhcmVudCB8fCBpc1ZvaWQ7XG4gICAgdGhpcy5pbXBsaWNpdE5hbWVzcGFjZVByZWZpeCA9IGltcGxpY2l0TmFtZXNwYWNlUHJlZml4IHx8IG51bGw7XG4gICAgdGhpcy5jb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlO1xuICAgIHRoaXMuaWdub3JlRmlyc3RMZiA9IGlnbm9yZUZpcnN0TGY7XG4gICAgdGhpcy5wcmV2ZW50TmFtZXNwYWNlSW5oZXJpdGFuY2UgPSBwcmV2ZW50TmFtZXNwYWNlSW5oZXJpdGFuY2U7XG4gICAgdGhpcy5jYW5TZWxmQ2xvc2UgPSBjYW5TZWxmQ2xvc2UgPz8gaXNWb2lkO1xuICB9XG5cbiAgaXNDbG9zZWRCeUNoaWxkKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzVm9pZCB8fCBuYW1lLnRvTG93ZXJDYXNlKCkgaW4gdGhpcy5jbG9zZWRCeUNoaWxkcmVuO1xuICB9XG5cbiAgZ2V0Q29udGVudFR5cGUocHJlZml4Pzogc3RyaW5nKTogVGFnQ29udGVudFR5cGUge1xuICAgIGlmICh0eXBlb2YgdGhpcy5jb250ZW50VHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGNvbnN0IG92ZXJyaWRlVHlwZSA9IHByZWZpeCA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogdGhpcy5jb250ZW50VHlwZVtwcmVmaXhdO1xuICAgICAgcmV0dXJuIG92ZXJyaWRlVHlwZSA/PyB0aGlzLmNvbnRlbnRUeXBlLmRlZmF1bHQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRlbnRUeXBlO1xuICB9XG59XG5cbmxldCBERUZBVUxUX1RBR19ERUZJTklUSU9OITogSHRtbFRhZ0RlZmluaXRpb247XG5cbi8vIHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUxL3N5bnRheC5odG1sI29wdGlvbmFsLXRhZ3Ncbi8vIFRoaXMgaW1wbGVtZW50YXRpb24gZG9lcyBub3QgZnVsbHkgY29uZm9ybSB0byB0aGUgSFRNTDUgc3BlYy5cbmxldCBUQUdfREVGSU5JVElPTlMhOiB7W2tleTogc3RyaW5nXTogSHRtbFRhZ0RlZmluaXRpb259O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHRtbFRhZ0RlZmluaXRpb24odGFnTmFtZTogc3RyaW5nKTogSHRtbFRhZ0RlZmluaXRpb24ge1xuICBpZiAoIVRBR19ERUZJTklUSU9OUykge1xuICAgIERFRkFVTFRfVEFHX0RFRklOSVRJT04gPSBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2NhblNlbGZDbG9zZTogdHJ1ZX0pO1xuICAgIFRBR19ERUZJTklUSU9OUyA9IHtcbiAgICAgICdiYXNlJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdtZXRhJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdhcmVhJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdlbWJlZCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnbGluayc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnaW1nJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdpbnB1dCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAncGFyYW0nOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ2hyJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdicic6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnc291cmNlJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICd0cmFjayc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICAgICAnd2JyJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgICAgICdwJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtcbiAgICAgICAgY2xvc2VkQnlDaGlsZHJlbjogW1xuICAgICAgICAgICdhZGRyZXNzJywgJ2FydGljbGUnLCAnYXNpZGUnLCAgICdibG9ja3F1b3RlJywgJ2RpdicsICAnZGwnLCAgJ2ZpZWxkc2V0JyxcbiAgICAgICAgICAnZm9vdGVyJywgICdmb3JtJywgICAgJ2gxJywgICAgICAnaDInLCAgICAgICAgICdoMycsICAgJ2g0JywgICdoNScsXG4gICAgICAgICAgJ2g2JywgICAgICAnaGVhZGVyJywgICdoZ3JvdXAnLCAgJ2hyJywgICAgICAgICAnbWFpbicsICduYXYnLCAnb2wnLFxuICAgICAgICAgICdwJywgICAgICAgJ3ByZScsICAgICAnc2VjdGlvbicsICd0YWJsZScsICAgICAgJ3VsJ1xuICAgICAgICBdLFxuICAgICAgICBjbG9zZWRCeVBhcmVudDogdHJ1ZVxuICAgICAgfSksXG4gICAgICAndGhlYWQnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsndGJvZHknLCAndGZvb3QnXX0pLFxuICAgICAgJ3Rib2R5JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3Rib2R5JywgJ3Rmb290J10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAndGZvb3QnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsndGJvZHknXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICd0cic6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWyd0ciddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3RkJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3RkJywgJ3RoJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAndGgnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsndGQnLCAndGgnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgICAgICdjb2wnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAgICAgJ3N2Zyc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aW1wbGljaXROYW1lc3BhY2VQcmVmaXg6ICdzdmcnfSksXG4gICAgICAnZm9yZWlnbk9iamVjdCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7XG4gICAgICAgIC8vIFVzdWFsbHkgdGhlIGltcGxpY2l0IG5hbWVzcGFjZSBoZXJlIHdvdWxkIGJlIHJlZHVuZGFudCBzaW5jZSBpdCB3aWxsIGJlIGluaGVyaXRlZCBmcm9tXG4gICAgICAgIC8vIHRoZSBwYXJlbnQgYHN2Z2AsIGJ1dCB3ZSBoYXZlIHRvIGRvIGl0IGZvciBgZm9yZWlnbk9iamVjdGAsIGJlY2F1c2UgdGhlIHdheSB0aGUgcGFyc2VyXG4gICAgICAgIC8vIHdvcmtzIGlzIHRoYXQgdGhlIHBhcmVudCBub2RlIG9mIGFuIGVuZCB0YWcgaXMgaXRzIG93biBzdGFydCB0YWcgd2hpY2ggbWVhbnMgdGhhdFxuICAgICAgICAvLyB0aGUgYHByZXZlbnROYW1lc3BhY2VJbmhlcml0YW5jZWAgb24gYGZvcmVpZ25PYmplY3RgIHdvdWxkIGhhdmUgaXQgZGVmYXVsdCB0byB0aGVcbiAgICAgICAgLy8gaW1wbGljaXQgbmFtZXNwYWNlIHdoaWNoIGlzIGBodG1sYCwgdW5sZXNzIHNwZWNpZmllZCBvdGhlcndpc2UuXG4gICAgICAgIGltcGxpY2l0TmFtZXNwYWNlUHJlZml4OiAnc3ZnJyxcbiAgICAgICAgLy8gV2Ugd2FudCB0byBwcmV2ZW50IGNoaWxkcmVuIG9mIGZvcmVpZ25PYmplY3QgZnJvbSBpbmhlcml0aW5nIGl0cyBuYW1lc3BhY2UsIGJlY2F1c2VcbiAgICAgICAgLy8gdGhlIHBvaW50IG9mIHRoZSBlbGVtZW50IGlzIHRvIGFsbG93IG5vZGVzIGZyb20gb3RoZXIgbmFtZXNwYWNlcyB0byBiZSBpbnNlcnRlZC5cbiAgICAgICAgcHJldmVudE5hbWVzcGFjZUluaGVyaXRhbmNlOiB0cnVlLFxuICAgICAgfSksXG4gICAgICAnbWF0aCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aW1wbGljaXROYW1lc3BhY2VQcmVmaXg6ICdtYXRoJ30pLFxuICAgICAgJ2xpJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ2xpJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAnZHQnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsnZHQnLCAnZGQnXX0pLFxuICAgICAgJ2RkJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ2R0JywgJ2RkJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAncmInOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oXG4gICAgICAgICAge2Nsb3NlZEJ5Q2hpbGRyZW46IFsncmInLCAncnQnLCAncnRjJywgJ3JwJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAncnQnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oXG4gICAgICAgICAge2Nsb3NlZEJ5Q2hpbGRyZW46IFsncmInLCAncnQnLCAncnRjJywgJ3JwJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAncnRjJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3JiJywgJ3J0YycsICdycCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ3JwJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKFxuICAgICAgICAgIHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3JiJywgJ3J0JywgJ3J0YycsICdycCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAgICAgJ29wdGdyb3VwJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ29wdGdyb3VwJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAnb3B0aW9uJzpcbiAgICAgICAgICBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsnb3B0aW9uJywgJ29wdGdyb3VwJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICAgICAncHJlJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpZ25vcmVGaXJzdExmOiB0cnVlfSksXG4gICAgICAnbGlzdGluZyc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aWdub3JlRmlyc3RMZjogdHJ1ZX0pLFxuICAgICAgJ3N0eWxlJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjb250ZW50VHlwZTogVGFnQ29udGVudFR5cGUuUkFXX1RFWFR9KSxcbiAgICAgICdzY3JpcHQnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2NvbnRlbnRUeXBlOiBUYWdDb250ZW50VHlwZS5SQVdfVEVYVH0pLFxuICAgICAgJ3RpdGxlJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtcbiAgICAgICAgLy8gVGhlIGJyb3dzZXIgc3VwcG9ydHMgdHdvIHNlcGFyYXRlIGB0aXRsZWAgdGFncyB3aGljaCBoYXZlIHRvIHVzZVxuICAgICAgICAvLyBhIGRpZmZlcmVudCBjb250ZW50IHR5cGU6IGBIVE1MVGl0bGVFbGVtZW50YCBhbmQgYFNWR1RpdGxlRWxlbWVudGBcbiAgICAgICAgY29udGVudFR5cGU6IHtkZWZhdWx0OiBUYWdDb250ZW50VHlwZS5FU0NBUEFCTEVfUkFXX1RFWFQsIHN2ZzogVGFnQ29udGVudFR5cGUuUEFSU0FCTEVfREFUQX1cbiAgICAgIH0pLFxuICAgICAgJ3RleHRhcmVhJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKFxuICAgICAgICAgIHtjb250ZW50VHlwZTogVGFnQ29udGVudFR5cGUuRVNDQVBBQkxFX1JBV19URVhULCBpZ25vcmVGaXJzdExmOiB0cnVlfSksXG4gICAgfTtcblxuICAgIG5ldyBEb21FbGVtZW50U2NoZW1hUmVnaXN0cnkoKS5hbGxLbm93bkVsZW1lbnROYW1lcygpLmZvckVhY2goa25vd25UYWdOYW1lID0+IHtcbiAgICAgIGlmICghVEFHX0RFRklOSVRJT05TLmhhc093blByb3BlcnR5KGtub3duVGFnTmFtZSkgJiYgZ2V0TnNQcmVmaXgoa25vd25UYWdOYW1lKSA9PT0gbnVsbCkge1xuICAgICAgICBUQUdfREVGSU5JVElPTlNba25vd25UYWdOYW1lXSA9IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2FuU2VsZkNsb3NlOiBmYWxzZX0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8vIFdlIGhhdmUgdG8gbWFrZSBib3RoIGEgY2FzZS1zZW5zaXRpdmUgYW5kIGEgY2FzZS1pbnNlbnNpdGl2ZSBsb29rdXAsIGJlY2F1c2VcbiAgLy8gSFRNTCB0YWcgbmFtZXMgYXJlIGNhc2UgaW5zZW5zaXRpdmUsIHdoZXJlYXMgc29tZSBTVkcgdGFncyBhcmUgY2FzZSBzZW5zaXRpdmUuXG4gIHJldHVybiBUQUdfREVGSU5JVElPTlNbdGFnTmFtZV0gPz8gVEFHX0RFRklOSVRJT05TW3RhZ05hbWUudG9Mb3dlckNhc2UoKV0gPz9cbiAgICAgIERFRkFVTFRfVEFHX0RFRklOSVRJT047XG59XG4iXX0=