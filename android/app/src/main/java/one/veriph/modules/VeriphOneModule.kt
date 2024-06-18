package one.veriph.modules

import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import one.veriph.sdk.ui.util.VerificationParams
import one.veriph.sdk.ui.util.VerificationResultContract

class VeriphOneModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "VeriphOneModule"
    }

    @ReactMethod
    fun subscribeToVerificationEvent(
        apiKey: String,
        sessionUuid: String,
        callback: Callback
    ) {
        val activity = (this.reactContext.currentActivity as AppCompatActivity)
        val launcher = activity.activityResultRegistry.register(
            "VeriphOneResultCallback",
            VerificationResultContract()
        ) { result: String? ->
            callback.invoke(result)
        }
        launcher.launch(VerificationParams(sessionUuid, apiKey))
    }
}