import boto3

ENDPOINT_NAME = 'sagemaker-xgboost-2023-03-15-19-30-07-737'
runtime = boto3.client ('runtime.sagemaker')
sns_email_client = boto3.client('sns')
ses_email_client = boto3.client('ses')

def lambda_handler (event, context):
    if "responseType" in event:
        to_email = event['email']
        subject = "Regarding your recent loan application"
        body = """
                Hello {}, <br><br>
                This email is regarding your recent loan application with our bank.<br>
                Your information is being processed.
                No further input is required form your side. <br><br>
                Thanks and Regards, <br>
                Employee
                """.format(event['name'])
        
        message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": body}}}
        response_ses = ses_email_client.send_email(Source = "loandefaultprediction@gmail.com",
                  Destination = {"ToAddresses": [to_email]}, Message = message)
        return "Done"
    else:
        inputs = event['data']
        serialized_input = ','.join(map(str, inputs[0]))
        
        response = runtime.invoke_endpoint(EndpointName=ENDPOINT_NAME,
                                            ContentType='text/csv',
                                            Body=serialized_input)
        
        result = response['Body'].read().decode()
        print(type(result))
        
        response_sns = sns_email_client.publish(
        TopicArn = 'arn:aws:sns:us-east-1:961848762648:LoanDefaultNotifaction',
        Message = 
        """
Hello,
        
This notification is in response to the latest prediction ran by a Bank employee.
\nLoan application was for customer {} and the recovery probability is {:.2f}.
\nThanks and Regards,
Bot
        """.format(event['name'],float(result.replace("\n",""))),
        Subject = 'Loan Default Prediction Endpoint Response')
        
        return result