//import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from 'npm:@supabase/supabase-js@2.45.0';
//import { corsHeaders } from './cors';

//export type GlobalFunctionsError = FunctionsHttpError | FunctionsRelayError | FunctionsFetchError;

//export const errorHandler = async (error: GlobalFunctionsError) => {
//  let errorMessage = 'An unknown error occurred'

//  if (error instanceof FunctionsHttpError) {
//    errorMessage = await error.context.json()
//    console.log('[❌ errorHandler] Function returned an error', errorMessage)
//  } else if (error instanceof FunctionsRelayError) {
//    errorMessage = error.message;
//    console.log('[❌ errorHandler] Relay error:', errorMessage)
//  } else if (error instanceof FunctionsFetchError) {
//    errorMessage = error.message;
//    console.log('[❌ errorHandler] Fetch error:', errorMessage)
//  }

//  return new Response(JSON.stringify({
//    error: errorMessage
//  }), {
//    headers: {
//      'Content-Type': 'application/json',
//      ...corsHeaders
//    },
//    status: 500
//  });
//};

