import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"

export interface BackProps extends cdk.StackProps {
  stage: string
}

export class Back extends cdk.Stack {
  constructor(scope: Construct, id: string, props: BackProps) {
    super(scope, id, props)

    // TODO: implement
  }
}
