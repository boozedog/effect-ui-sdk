// Class helpers from the optional adapter. Applied only when `style=daisy`,
// so the default page does not wear daisy class names with no stylesheet.
import { Schema } from "effect"
import * as classes from "@boozedog/effect-ui-sdk-daisy/classes"

export const Props = Schema.Struct({ daisy: Schema.Boolean })

export const face = (daisy: boolean, token: string): string | false => (daisy ? token : false)

export { classes }
