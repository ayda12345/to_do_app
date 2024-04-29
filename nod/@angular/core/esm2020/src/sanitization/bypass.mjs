/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { XSS_SECURITY_URL } from '../error_details_base_url';
class SafeValueImpl {
    constructor(changingThisBreaksApplicationSecurity) {
        this.changingThisBreaksApplicationSecurity = changingThisBreaksApplicationSecurity;
    }
    toString() {
        return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity}` +
            ` (see ${XSS_SECURITY_URL})`;
    }
}
class SafeHtmlImpl extends SafeValueImpl {
    getTypeName() {
        return "HTML" /* BypassType.Html */;
    }
}
class SafeStyleImpl extends SafeValueImpl {
    getTypeName() {
        return "Style" /* BypassType.Style */;
    }
}
class SafeScriptImpl extends SafeValueImpl {
    getTypeName() {
        return "Script" /* BypassType.Script */;
    }
}
class SafeUrlImpl extends SafeValueImpl {
    getTypeName() {
        return "URL" /* BypassType.Url */;
    }
}
class SafeResourceUrlImpl extends SafeValueImpl {
    getTypeName() {
        return "ResourceURL" /* BypassType.ResourceUrl */;
    }
}
export function unwrapSafeValue(value) {
    return value instanceof SafeValueImpl ? value.changingThisBreaksApplicationSecurity :
        value;
}
export function allowSanitizationBypassAndThrow(value, type) {
    const actualType = getSanitizationBypassType(value);
    if (actualType != null && actualType !== type) {
        // Allow ResourceURLs in URL contexts, they are strictly more trusted.
        if (actualType === "ResourceURL" /* BypassType.ResourceUrl */ && type === "URL" /* BypassType.Url */)
            return true;
        throw new Error(`Required a safe ${type}, got a ${actualType} (see ${XSS_SECURITY_URL})`);
    }
    return actualType === type;
}
export function getSanitizationBypassType(value) {
    return value instanceof SafeValueImpl && value.getTypeName() || null;
}
/**
 * Mark `html` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link htmlSanitizer} to be trusted implicitly.
 *
 * @param trustedHtml `html` string which needs to be implicitly trusted.
 * @returns a `html` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustHtml(trustedHtml) {
    return new SafeHtmlImpl(trustedHtml);
}
/**
 * Mark `style` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link styleSanitizer} to be trusted implicitly.
 *
 * @param trustedStyle `style` string which needs to be implicitly trusted.
 * @returns a `style` hich has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustStyle(trustedStyle) {
    return new SafeStyleImpl(trustedStyle);
}
/**
 * Mark `script` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link scriptSanitizer} to be trusted implicitly.
 *
 * @param trustedScript `script` string which needs to be implicitly trusted.
 * @returns a `script` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustScript(trustedScript) {
    return new SafeScriptImpl(trustedScript);
}
/**
 * Mark `url` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link urlSanitizer} to be trusted implicitly.
 *
 * @param trustedUrl `url` string which needs to be implicitly trusted.
 * @returns a `url`  which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustUrl(trustedUrl) {
    return new SafeUrlImpl(trustedUrl);
}
/**
 * Mark `url` string as trusted.
 *
 * This function wraps the trusted string in `String` and brands it in a way which makes it
 * recognizable to {@link resourceUrlSanitizer} to be trusted implicitly.
 *
 * @param trustedResourceUrl `url` string which needs to be implicitly trusted.
 * @returns a `url` which has been branded to be implicitly trusted.
 */
export function bypassSanitizationTrustResourceUrl(trustedResourceUrl) {
    return new SafeResourceUrlImpl(trustedResourceUrl);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnlwYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvc2FuaXRpemF0aW9uL2J5cGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQXFEM0QsTUFBZSxhQUFhO0lBQzFCLFlBQW1CLHFDQUE2QztRQUE3QywwQ0FBcUMsR0FBckMscUNBQXFDLENBQVE7SUFBRyxDQUFDO0lBSXBFLFFBQVE7UUFDTixPQUFPLDBDQUEwQyxJQUFJLENBQUMscUNBQXFDLEVBQUU7WUFDekYsU0FBUyxnQkFBZ0IsR0FBRyxDQUFDO0lBQ25DLENBQUM7Q0FDRjtBQUVELE1BQU0sWUFBYSxTQUFRLGFBQWE7SUFDN0IsV0FBVztRQUNsQixvQ0FBdUI7SUFDekIsQ0FBQztDQUNGO0FBQ0QsTUFBTSxhQUFjLFNBQVEsYUFBYTtJQUM5QixXQUFXO1FBQ2xCLHNDQUF3QjtJQUMxQixDQUFDO0NBQ0Y7QUFDRCxNQUFNLGNBQWUsU0FBUSxhQUFhO0lBQy9CLFdBQVc7UUFDbEIsd0NBQXlCO0lBQzNCLENBQUM7Q0FDRjtBQUNELE1BQU0sV0FBWSxTQUFRLGFBQWE7SUFDNUIsV0FBVztRQUNsQixrQ0FBc0I7SUFDeEIsQ0FBQztDQUNGO0FBQ0QsTUFBTSxtQkFBb0IsU0FBUSxhQUFhO0lBQ3BDLFdBQVc7UUFDbEIsa0RBQThCO0lBQ2hDLENBQUM7Q0FDRjtBQUlELE1BQU0sVUFBVSxlQUFlLENBQUksS0FBa0I7SUFDbkQsT0FBTyxLQUFLLFlBQVksYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMscUNBQWlELENBQUMsQ0FBQztRQUN6RCxLQUFpQixDQUFDO0FBQzVELENBQUM7QUFhRCxNQUFNLFVBQVUsK0JBQStCLENBQUMsS0FBVSxFQUFFLElBQWdCO0lBQzFFLE1BQU0sVUFBVSxHQUFHLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BELElBQUksVUFBVSxJQUFJLElBQUksSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO1FBQzdDLHNFQUFzRTtRQUN0RSxJQUFJLFVBQVUsK0NBQTJCLElBQUksSUFBSSwrQkFBbUI7WUFBRSxPQUFPLElBQUksQ0FBQztRQUNsRixNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixJQUFJLFdBQVcsVUFBVSxTQUFTLGdCQUFnQixHQUFHLENBQUMsQ0FBQztLQUMzRjtJQUNELE9BQU8sVUFBVSxLQUFLLElBQUksQ0FBQztBQUM3QixDQUFDO0FBRUQsTUFBTSxVQUFVLHlCQUF5QixDQUFDLEtBQVU7SUFDbEQsT0FBTyxLQUFLLFlBQVksYUFBYSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQWdCLElBQUksSUFBSSxDQUFDO0FBQ3JGLENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSwyQkFBMkIsQ0FBQyxXQUFtQjtJQUM3RCxPQUFPLElBQUksWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFDRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSw0QkFBNEIsQ0FBQyxZQUFvQjtJQUMvRCxPQUFPLElBQUksYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFDRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSw2QkFBNkIsQ0FBQyxhQUFxQjtJQUNqRSxPQUFPLElBQUksY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFDRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSwwQkFBMEIsQ0FBQyxVQUFrQjtJQUMzRCxPQUFPLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFDRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSxrQ0FBa0MsQ0FBQyxrQkFBMEI7SUFDM0UsT0FBTyxJQUFJLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDckQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1hTU19TRUNVUklUWV9VUkx9IGZyb20gJy4uL2Vycm9yX2RldGFpbHNfYmFzZV91cmwnO1xuXG5leHBvcnQgY29uc3QgZW51bSBCeXBhc3NUeXBlIHtcbiAgVXJsID0gJ1VSTCcsXG4gIEh0bWwgPSAnSFRNTCcsXG4gIFJlc291cmNlVXJsID0gJ1Jlc291cmNlVVJMJyxcbiAgU2NyaXB0ID0gJ1NjcmlwdCcsXG4gIFN0eWxlID0gJ1N0eWxlJyxcbn1cblxuLyoqXG4gKiBNYXJrZXIgaW50ZXJmYWNlIGZvciBhIHZhbHVlIHRoYXQncyBzYWZlIHRvIHVzZSBpbiBhIHBhcnRpY3VsYXIgY29udGV4dC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2FmZVZhbHVlIHt9XG5cbi8qKlxuICogTWFya2VyIGludGVyZmFjZSBmb3IgYSB2YWx1ZSB0aGF0J3Mgc2FmZSB0byB1c2UgYXMgSFRNTC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2FmZUh0bWwgZXh0ZW5kcyBTYWZlVmFsdWUge31cblxuLyoqXG4gKiBNYXJrZXIgaW50ZXJmYWNlIGZvciBhIHZhbHVlIHRoYXQncyBzYWZlIHRvIHVzZSBhcyBzdHlsZSAoQ1NTKS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2FmZVN0eWxlIGV4dGVuZHMgU2FmZVZhbHVlIHt9XG5cbi8qKlxuICogTWFya2VyIGludGVyZmFjZSBmb3IgYSB2YWx1ZSB0aGF0J3Mgc2FmZSB0byB1c2UgYXMgSmF2YVNjcmlwdC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2FmZVNjcmlwdCBleHRlbmRzIFNhZmVWYWx1ZSB7fVxuXG4vKipcbiAqIE1hcmtlciBpbnRlcmZhY2UgZm9yIGEgdmFsdWUgdGhhdCdzIHNhZmUgdG8gdXNlIGFzIGEgVVJMIGxpbmtpbmcgdG8gYSBkb2N1bWVudC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2FmZVVybCBleHRlbmRzIFNhZmVWYWx1ZSB7fVxuXG4vKipcbiAqIE1hcmtlciBpbnRlcmZhY2UgZm9yIGEgdmFsdWUgdGhhdCdzIHNhZmUgdG8gdXNlIGFzIGEgVVJMIHRvIGxvYWQgZXhlY3V0YWJsZSBjb2RlIGZyb20uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNhZmVSZXNvdXJjZVVybCBleHRlbmRzIFNhZmVWYWx1ZSB7fVxuXG5cbmFic3RyYWN0IGNsYXNzIFNhZmVWYWx1ZUltcGwgaW1wbGVtZW50cyBTYWZlVmFsdWUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY2hhbmdpbmdUaGlzQnJlYWtzQXBwbGljYXRpb25TZWN1cml0eTogc3RyaW5nKSB7fVxuXG4gIGFic3RyYWN0IGdldFR5cGVOYW1lKCk6IHN0cmluZztcblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYFNhZmVWYWx1ZSBtdXN0IHVzZSBbcHJvcGVydHldPWJpbmRpbmc6ICR7dGhpcy5jaGFuZ2luZ1RoaXNCcmVha3NBcHBsaWNhdGlvblNlY3VyaXR5fWAgK1xuICAgICAgICBgIChzZWUgJHtYU1NfU0VDVVJJVFlfVVJMfSlgO1xuICB9XG59XG5cbmNsYXNzIFNhZmVIdG1sSW1wbCBleHRlbmRzIFNhZmVWYWx1ZUltcGwgaW1wbGVtZW50cyBTYWZlSHRtbCB7XG4gIG92ZXJyaWRlIGdldFR5cGVOYW1lKCkge1xuICAgIHJldHVybiBCeXBhc3NUeXBlLkh0bWw7XG4gIH1cbn1cbmNsYXNzIFNhZmVTdHlsZUltcGwgZXh0ZW5kcyBTYWZlVmFsdWVJbXBsIGltcGxlbWVudHMgU2FmZVN0eWxlIHtcbiAgb3ZlcnJpZGUgZ2V0VHlwZU5hbWUoKSB7XG4gICAgcmV0dXJuIEJ5cGFzc1R5cGUuU3R5bGU7XG4gIH1cbn1cbmNsYXNzIFNhZmVTY3JpcHRJbXBsIGV4dGVuZHMgU2FmZVZhbHVlSW1wbCBpbXBsZW1lbnRzIFNhZmVTY3JpcHQge1xuICBvdmVycmlkZSBnZXRUeXBlTmFtZSgpIHtcbiAgICByZXR1cm4gQnlwYXNzVHlwZS5TY3JpcHQ7XG4gIH1cbn1cbmNsYXNzIFNhZmVVcmxJbXBsIGV4dGVuZHMgU2FmZVZhbHVlSW1wbCBpbXBsZW1lbnRzIFNhZmVVcmwge1xuICBvdmVycmlkZSBnZXRUeXBlTmFtZSgpIHtcbiAgICByZXR1cm4gQnlwYXNzVHlwZS5Vcmw7XG4gIH1cbn1cbmNsYXNzIFNhZmVSZXNvdXJjZVVybEltcGwgZXh0ZW5kcyBTYWZlVmFsdWVJbXBsIGltcGxlbWVudHMgU2FmZVJlc291cmNlVXJsIHtcbiAgb3ZlcnJpZGUgZ2V0VHlwZU5hbWUoKSB7XG4gICAgcmV0dXJuIEJ5cGFzc1R5cGUuUmVzb3VyY2VVcmw7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcFNhZmVWYWx1ZSh2YWx1ZTogU2FmZVZhbHVlKTogc3RyaW5nO1xuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcFNhZmVWYWx1ZTxUPih2YWx1ZTogVCk6IFQ7XG5leHBvcnQgZnVuY3Rpb24gdW53cmFwU2FmZVZhbHVlPFQ+KHZhbHVlOiBUfFNhZmVWYWx1ZSk6IFQge1xuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBTYWZlVmFsdWVJbXBsID8gdmFsdWUuY2hhbmdpbmdUaGlzQnJlYWtzQXBwbGljYXRpb25TZWN1cml0eSBhcyBhbnkgYXMgVCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSBhcyBhbnkgYXMgVDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYWxsb3dTYW5pdGl6YXRpb25CeXBhc3NBbmRUaHJvdyhcbiAgICB2YWx1ZTogYW55LCB0eXBlOiBCeXBhc3NUeXBlLkh0bWwpOiB2YWx1ZSBpcyBTYWZlSHRtbDtcbmV4cG9ydCBmdW5jdGlvbiBhbGxvd1Nhbml0aXphdGlvbkJ5cGFzc0FuZFRocm93KFxuICAgIHZhbHVlOiBhbnksIHR5cGU6IEJ5cGFzc1R5cGUuUmVzb3VyY2VVcmwpOiB2YWx1ZSBpcyBTYWZlUmVzb3VyY2VVcmw7XG5leHBvcnQgZnVuY3Rpb24gYWxsb3dTYW5pdGl6YXRpb25CeXBhc3NBbmRUaHJvdyhcbiAgICB2YWx1ZTogYW55LCB0eXBlOiBCeXBhc3NUeXBlLlNjcmlwdCk6IHZhbHVlIGlzIFNhZmVTY3JpcHQ7XG5leHBvcnQgZnVuY3Rpb24gYWxsb3dTYW5pdGl6YXRpb25CeXBhc3NBbmRUaHJvdyhcbiAgICB2YWx1ZTogYW55LCB0eXBlOiBCeXBhc3NUeXBlLlN0eWxlKTogdmFsdWUgaXMgU2FmZVN0eWxlO1xuZXhwb3J0IGZ1bmN0aW9uIGFsbG93U2FuaXRpemF0aW9uQnlwYXNzQW5kVGhyb3codmFsdWU6IGFueSwgdHlwZTogQnlwYXNzVHlwZS5VcmwpOiB2YWx1ZSBpcyBTYWZlVXJsO1xuZXhwb3J0IGZ1bmN0aW9uIGFsbG93U2FuaXRpemF0aW9uQnlwYXNzQW5kVGhyb3codmFsdWU6IGFueSwgdHlwZTogQnlwYXNzVHlwZSk6IGJvb2xlYW47XG5leHBvcnQgZnVuY3Rpb24gYWxsb3dTYW5pdGl6YXRpb25CeXBhc3NBbmRUaHJvdyh2YWx1ZTogYW55LCB0eXBlOiBCeXBhc3NUeXBlKTogYm9vbGVhbiB7XG4gIGNvbnN0IGFjdHVhbFR5cGUgPSBnZXRTYW5pdGl6YXRpb25CeXBhc3NUeXBlKHZhbHVlKTtcbiAgaWYgKGFjdHVhbFR5cGUgIT0gbnVsbCAmJiBhY3R1YWxUeXBlICE9PSB0eXBlKSB7XG4gICAgLy8gQWxsb3cgUmVzb3VyY2VVUkxzIGluIFVSTCBjb250ZXh0cywgdGhleSBhcmUgc3RyaWN0bHkgbW9yZSB0cnVzdGVkLlxuICAgIGlmIChhY3R1YWxUeXBlID09PSBCeXBhc3NUeXBlLlJlc291cmNlVXJsICYmIHR5cGUgPT09IEJ5cGFzc1R5cGUuVXJsKSByZXR1cm4gdHJ1ZTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFJlcXVpcmVkIGEgc2FmZSAke3R5cGV9LCBnb3QgYSAke2FjdHVhbFR5cGV9IChzZWUgJHtYU1NfU0VDVVJJVFlfVVJMfSlgKTtcbiAgfVxuICByZXR1cm4gYWN0dWFsVHlwZSA9PT0gdHlwZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNhbml0aXphdGlvbkJ5cGFzc1R5cGUodmFsdWU6IGFueSk6IEJ5cGFzc1R5cGV8bnVsbCB7XG4gIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFNhZmVWYWx1ZUltcGwgJiYgdmFsdWUuZ2V0VHlwZU5hbWUoKSBhcyBCeXBhc3NUeXBlIHx8IG51bGw7XG59XG5cbi8qKlxuICogTWFyayBgaHRtbGAgc3RyaW5nIGFzIHRydXN0ZWQuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3cmFwcyB0aGUgdHJ1c3RlZCBzdHJpbmcgaW4gYFN0cmluZ2AgYW5kIGJyYW5kcyBpdCBpbiBhIHdheSB3aGljaCBtYWtlcyBpdFxuICogcmVjb2duaXphYmxlIHRvIHtAbGluayBodG1sU2FuaXRpemVyfSB0byBiZSB0cnVzdGVkIGltcGxpY2l0bHkuXG4gKlxuICogQHBhcmFtIHRydXN0ZWRIdG1sIGBodG1sYCBzdHJpbmcgd2hpY2ggbmVlZHMgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICogQHJldHVybnMgYSBgaHRtbGAgd2hpY2ggaGFzIGJlZW4gYnJhbmRlZCB0byBiZSBpbXBsaWNpdGx5IHRydXN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdEh0bWwodHJ1c3RlZEh0bWw6IHN0cmluZyk6IFNhZmVIdG1sIHtcbiAgcmV0dXJuIG5ldyBTYWZlSHRtbEltcGwodHJ1c3RlZEh0bWwpO1xufVxuLyoqXG4gKiBNYXJrIGBzdHlsZWAgc3RyaW5nIGFzIHRydXN0ZWQuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3cmFwcyB0aGUgdHJ1c3RlZCBzdHJpbmcgaW4gYFN0cmluZ2AgYW5kIGJyYW5kcyBpdCBpbiBhIHdheSB3aGljaCBtYWtlcyBpdFxuICogcmVjb2duaXphYmxlIHRvIHtAbGluayBzdHlsZVNhbml0aXplcn0gdG8gYmUgdHJ1c3RlZCBpbXBsaWNpdGx5LlxuICpcbiAqIEBwYXJhbSB0cnVzdGVkU3R5bGUgYHN0eWxlYCBzdHJpbmcgd2hpY2ggbmVlZHMgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICogQHJldHVybnMgYSBgc3R5bGVgIGhpY2ggaGFzIGJlZW4gYnJhbmRlZCB0byBiZSBpbXBsaWNpdGx5IHRydXN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFN0eWxlKHRydXN0ZWRTdHlsZTogc3RyaW5nKTogU2FmZVN0eWxlIHtcbiAgcmV0dXJuIG5ldyBTYWZlU3R5bGVJbXBsKHRydXN0ZWRTdHlsZSk7XG59XG4vKipcbiAqIE1hcmsgYHNjcmlwdGAgc3RyaW5nIGFzIHRydXN0ZWQuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3cmFwcyB0aGUgdHJ1c3RlZCBzdHJpbmcgaW4gYFN0cmluZ2AgYW5kIGJyYW5kcyBpdCBpbiBhIHdheSB3aGljaCBtYWtlcyBpdFxuICogcmVjb2duaXphYmxlIHRvIHtAbGluayBzY3JpcHRTYW5pdGl6ZXJ9IHRvIGJlIHRydXN0ZWQgaW1wbGljaXRseS5cbiAqXG4gKiBAcGFyYW0gdHJ1c3RlZFNjcmlwdCBgc2NyaXB0YCBzdHJpbmcgd2hpY2ggbmVlZHMgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICogQHJldHVybnMgYSBgc2NyaXB0YCB3aGljaCBoYXMgYmVlbiBicmFuZGVkIHRvIGJlIGltcGxpY2l0bHkgdHJ1c3RlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ5cGFzc1Nhbml0aXphdGlvblRydXN0U2NyaXB0KHRydXN0ZWRTY3JpcHQ6IHN0cmluZyk6IFNhZmVTY3JpcHQge1xuICByZXR1cm4gbmV3IFNhZmVTY3JpcHRJbXBsKHRydXN0ZWRTY3JpcHQpO1xufVxuLyoqXG4gKiBNYXJrIGB1cmxgIHN0cmluZyBhcyB0cnVzdGVkLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd3JhcHMgdGhlIHRydXN0ZWQgc3RyaW5nIGluIGBTdHJpbmdgIGFuZCBicmFuZHMgaXQgaW4gYSB3YXkgd2hpY2ggbWFrZXMgaXRcbiAqIHJlY29nbml6YWJsZSB0byB7QGxpbmsgdXJsU2FuaXRpemVyfSB0byBiZSB0cnVzdGVkIGltcGxpY2l0bHkuXG4gKlxuICogQHBhcmFtIHRydXN0ZWRVcmwgYHVybGAgc3RyaW5nIHdoaWNoIG5lZWRzIHRvIGJlIGltcGxpY2l0bHkgdHJ1c3RlZC5cbiAqIEByZXR1cm5zIGEgYHVybGAgIHdoaWNoIGhhcyBiZWVuIGJyYW5kZWQgdG8gYmUgaW1wbGljaXRseSB0cnVzdGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnlwYXNzU2FuaXRpemF0aW9uVHJ1c3RVcmwodHJ1c3RlZFVybDogc3RyaW5nKTogU2FmZVVybCB7XG4gIHJldHVybiBuZXcgU2FmZVVybEltcGwodHJ1c3RlZFVybCk7XG59XG4vKipcbiAqIE1hcmsgYHVybGAgc3RyaW5nIGFzIHRydXN0ZWQuXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3cmFwcyB0aGUgdHJ1c3RlZCBzdHJpbmcgaW4gYFN0cmluZ2AgYW5kIGJyYW5kcyBpdCBpbiBhIHdheSB3aGljaCBtYWtlcyBpdFxuICogcmVjb2duaXphYmxlIHRvIHtAbGluayByZXNvdXJjZVVybFNhbml0aXplcn0gdG8gYmUgdHJ1c3RlZCBpbXBsaWNpdGx5LlxuICpcbiAqIEBwYXJhbSB0cnVzdGVkUmVzb3VyY2VVcmwgYHVybGAgc3RyaW5nIHdoaWNoIG5lZWRzIHRvIGJlIGltcGxpY2l0bHkgdHJ1c3RlZC5cbiAqIEByZXR1cm5zIGEgYHVybGAgd2hpY2ggaGFzIGJlZW4gYnJhbmRlZCB0byBiZSBpbXBsaWNpdGx5IHRydXN0ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBieXBhc3NTYW5pdGl6YXRpb25UcnVzdFJlc291cmNlVXJsKHRydXN0ZWRSZXNvdXJjZVVybDogc3RyaW5nKTogU2FmZVJlc291cmNlVXJsIHtcbiAgcmV0dXJuIG5ldyBTYWZlUmVzb3VyY2VVcmxJbXBsKHRydXN0ZWRSZXNvdXJjZVVybCk7XG59XG4iXX0=