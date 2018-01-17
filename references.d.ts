/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="./node_modules/tns-platform-declarations/android.d.ts" />

declare module com {
	export module xushsh {
        export module searchview {
            export class XSSSearchView extends android.widget.LinearLayout {
                constructor(context: android.content.Context);
                constructor(context: android.content.Context, attrs: android.util.AttributeSet);
                setOnQueryTextListener(mCallBack: android.support.v7.widget.SearchView.OnQueryTextListener);
                setOnCloseListener(bCallBack: android.support.v7.widget.SearchView.OnCloseListener);
            }
        }
    }
}

// declare module android {
// 	export module support {
//         export module v7 {
//             export module widget {
//                 export class AppCompatEditText extends android.widget.EditText {
//                     constructor(context: android.content.Context);
//                     static class: java.lang.Class<android.support.v7.widget.AppCompatEditText>;
                 
//                 }
//             }
//         }
//     }
// }